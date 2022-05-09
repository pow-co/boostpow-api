
import { getTransaction, call } from './jsonrpc'

import { BoostPowJobProof } from 'boostpow'

import pg from './database'

import { events } from 'rabbi'

import * as filepay from 'filepay'

import * as bsv from 'bsv'

const delay = require('delay');

import * as boost from 'boostpow';

const { BoostPowJob } = require('boostpow')

import { Wallet } from 'anypay-simple-wallet'

import * as models from './models'

export interface BoostJob {
  txid: string;
  content: string;
  script: string;
  value: number;
  vout: number;
  difficulty: number;
  tag: string;
  category: string;
  userNonce: string;
  additionalData: string;
  spent: boolean;
}

export function getBoostJobsFromTx(tx: bsv.Transaction) {

  var index = 0
  var jobs = []

  for (let output of tx.outputs) {

    let job = boost.BoostPowJob.fromTransaction(tx, index)

    index +=1

    if (job) { jobs.push(job) }

  }
  
  return jobs

}

export async function getBoostJobsFromTxid(txid:string) {

  const tx = await getTransaction(txid)

  let {hex, json} = tx

  let jobs = json.vout.reduce((_jobs, vout) => {

    let job = boost.BoostPowJob.fromRawTransaction(hex, vout['n'])

    if (job) { _jobs.push(job) }

    return _jobs

  }, [])

  return jobs

}

export async function getBoostProof(txid: string): Promise<any> {

  let tx = await getTransaction(txid)

  let proof = boost.BoostPowJobProof.fromRawTransaction(tx.hex)

  return proof

}

export async function persistBoostJob(job: any): Promise<BoostJob> {

  let record = await models.BoostJob.findOne({
    where: { txid: job.txid }
  })

  if (record) {
    return record
  }

  let params = {
    txid: job.txid,
    content: job.toObject().content.toString(),
    script: job.toHex(),
    vout: job.vout,
    value: job.value,
    difficulty: job.difficulty,
    category: job.toObject().category.toString(),
    tag: job.toObject().tag.toString(),
    userNonce: job.toObject().userNonce.toString(),
    additionalData: job.toObject().additionalData.toString(),
    timestamp: new Date()
  }

  record = await models.BoostJob.create(params)

  return record

}

export async function getBoostJob(txid: string): Promise<BoostJob> {

  let tx = await getTransaction(txid)

  let { hex } = tx;

  let [record] = await pg('boost_jobs').where('txid', txid).returning('*')

  let job = boost.BoostPowJob.fromRawTransaction(tx.hex)

  if (record && !job) {
    return record
  }

  let spent = await checkBoostSpent(txid, job.vout)

  if (spent && !record.spent) {
    await pg('boost_jobs').update('spent', true).where('txid', txid).returning('*')
  }

  let out = {
    txid,
    content: job.toObject().content.toString(),
    script: tx.json.vout[job.vout].scriptPubKey.hex,
    vout: job.vout,
    value: job.value,
    difficulty: job.difficulty,
    category: job.toObject().category.toString(),
    tag: job.toObject().tag.toString(),
    userNonce: job.toObject().userNonce.toString(),
    additionalData: job.toObject().additionalData.toString(),
    spent
  }

  return out

}

export async function checkBoostSpent(txid: string, vout: number): Promise<boolean> {

  let {result}: any = await call('gettxout', [txid, vout])

  return !result

}

export async function importBoostProofByTxid(txid: string): Promise<any> {

  const proof = await getBoostProof(txid)

  return importBoostProof(proof)

}

export async function importBoostProofFromTxHex(txhex: string): Promise<any> {

  // ensure the transaction is broadcast to the network first

  let tx = new bsv.Transaction(txhex)

  console.log({ tx })

  tx = await getTransaction(tx.hash)

  if (!tx) {
    
    console.log('transaction not found')

    try {

      //broadcast transaction
      let response = await call('sendrawtransaction', [txhex])

      console.log(response)

    } catch(error) {

      console.error(error)

    }

  }

  let proof = boost.BoostPowJobProof.fromRawTransaction(txhex)

  console.log('PROOF', proof)

  return importBoostProof(proof)

}

export async function importBoostProof(proof): Promise<any> {

  console.log('importboostproof', proof)

  let where = {
    txid: proof.SpentTxid,
    vout: proof.SpentVout
  }


  let job = await models.BoostJob.findOne({
    where
  })

  console.log({ job })

  if (!job) {

    await importBoostJobFromTxid(proof.SpentTxid)

    job = await models.BoostJob.findOne({
      where
    })

    if (!job) {

      return
    }

  }

  console.log('find proof record')

  let proof_record = await models.BoostWork.findOne({
    where: {
      job_txid: proof.SpentTxid
    }
  })

  console.log({ proof_record })

  if (job.spend_txid && proof_record) {

    return proof_record

  } else {

    if (!proof_record) {

      console.log('create boost work')

      proof_record = await models.BoostWork.create({
        job_txid: proof.SpentTxid,
        job_vout: proof.SpentVout,
        spend_txid: proof.Txid,
        spend_vout: proof.Vin,
        content: job.content,
        difficulty: job.difficulty,
        timestamp: new Date(),
        value: job.value
      })

      console.log('proof record', proof_record.toJSON())

      //await events.emit('work.published', proof_record)

      job.spent = true;
      job.spent_txid = proof.Txid;
      job.spent_vout = proof.Vin;
      await job.save()

      //events.emit('job.completed', { job: job.toJSON(), work: proof_record })

    }

    console.log('find job record')

    let jobRecord = await models.BoostJob.findOne({
      where: {
        txid: proof.SpentTxid,
        vout: proof.SpentVout
      }
    })

    console.log('found job record', jobRecord.toJSON())

    jobRecord.spend_txid = proof.SpentTxid
    jobRecord.spend_vout = proof.SpentVout
    jobRecord.spent = true

    await jobRecord.save()

    console.log('job record updated', jobRecord.toJSON())

  }

  return proof_record

}

export async function importBoostJob(job: typeof BoostPowJob, txhex: string) {

  let record = await models.BoostJob.findOne({
    where: {
      txid: job.txid,
      vout: job.vout
    }
  })

  if (record) {

    return record

  } else {

    let tx = await getTransaction(job.txid)

    if (tx) {

    } else {

      // broadcast transaction
      let response = await call('sendrawtransaction', [txhex])

    }

    // if successfull, import into database
    return importBoostJobFromTxid(job.txid)

  }

}

export async function importBoostJobFromTxid(txid: string) {

  let jobs: BoostJob[] = await getBoostJobsFromTxid(txid)

  let records = await Promise.all(jobs.map(async job => {

    let record = await models.BoostJob.findOne({

      where: {

        vout: job.vout,

        txid: job.txid

      }

    })

    if (record && record.script) {

      return record
    }

    return persistBoostJob(job)

  }))

  return records
}

interface NewJob {
  content: string;
  difficulty: number;
  satoshis: number;
}

type BoostPowJob = any;

export async function buildNewJobTransaction(job: BoostPowJob): Promise<bsv.Transaction> {

  const { satoshis } = job

  job = boost.BoostPowJob.fromObject(job)

  const wallet = Wallet.fromWIF(process.env.BSV_SIMPLE_WALLET_WIF)

  let utxos = await wallet.getUnspentOutputs()

  let tx = new bsv.Transaction()
    .from(utxos)
    .change(wallet.address)

  tx.addOutput(
    bsv.Transaction.Output({
      satoshis: satoshis,
      script: job.toHex()
    })
  )

  tx.sign(process.env.BSV_SIMPLE_WALLET_WIF)

  return tx;

}

export async function postNewJob(newJob: NewJob) {

  try {

    let job = boost.BoostPowJob.fromObject({
      content: newJob.content,
      diff: newJob.difficulty
    })

    var config = {
      pay: {
        key: process.env.BSV_SIMPLE_WALLET_WIF,
        rpc: "",
        to: [{
          script: job.toHex(),
          value: newJob.satoshis
        }],
        changeAddress: process.env.BSV_SIMPLE_WALLET_ADDRESS
      }
    }

    filepay.send(config, async (err, result) => {
      if (err) { throw err }
      let [txid] = result.split(' ')

      await delay(2000)

      try {

        let {hex} = await getTransaction(txid)

        let newRecord = await importBoostJobFromTxid(txid)

      } catch(error) {

        console.error(error)

      }

    })

  } catch(error) {

    console.error(error)

  }

}


