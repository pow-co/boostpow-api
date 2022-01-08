
import { getTransaction, call } from './jsonrpc'

import pg from './database'

import { events } from 'rabbi'

import * as filepay from 'filepay'

const delay = require('delay');

import * as boost from 'boostpow';

import * as models from '../models'

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

/*
export async function getBoostJobsFromRawTx(hex:string) {

  let tx = new bsv.Transaction(hex)

  let jobs = tx.vout.reduce((_jobs, vout) => {

    let job = boost.BoostPowJob.fromRawTransaction(hex, vout['n'])

    if (job) { _jobs.push(job) }

    return _jobs

  }, [])

  return jobs

}
*/

export async function getBoostJobsFromTxid(txid:string) {

  let {hex, json} = await getTransaction(txid)

  let jobs = json.vout.reduce((_jobs, vout) => {

    let job = boost.BoostPowJob.fromRawTransaction(hex, vout['n'])

    if (job) { _jobs.push(job) }

    return _jobs

  }, [])

  return jobs

}

export async function getBoostProof(txid: string) {

  let tx = await getTransaction(txid)

  let proof = boost.BoostPowJobProof.fromRawTransaction(tx.hex)

  return proof

}

export async function persistBoostJob(job: any): Promise<BoostJob> {

  let [record] = await pg('boost_jobs').where('txid', job.txid).returning('*')

  if (record) {
    return record
  }

  let params = {
    txid: job.txid,
    content: job.toObject().content.toString(),
    //script: tx.json.vout[job.vout].scriptPubKey.hex,
    vout: job.vout,
    value: job.value,
    difficulty: job.difficulty,
    category: job.toObject().category.toString(),
    tag: job.toObject().tag.toString(),
    userNonce: job.toObject().userNonce.toString(),
    additionalData: job.toObject().additionalData.toString(),
    inserted_at: new Date(),
    updated_at: new Date()
  }

  record = await pg('boost_jobs').insert(params).returning('*')

  return record

}

export async function getBoostJob(txid: string): Promise<BoostJob> {

  let tx = await getTransaction(txid)

  console.log(tx)

  let [record] = await pg('boost_jobs').where('txid', txid).returning('*')

  console.log('record', record)

  let job = boost.BoostPowJob.fromRawTransaction(tx.hex, record.vout)

  console.log('job', job)

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

  console.log('job', job)

  return out

}

export async function checkBoostSpent(txid: string, vout: number): Promise<boolean> {

  let {result}: any = await call('gettxout', [txid, vout])

  return !result

}

export async function importBoostProof(proof: any): Promise<any> {

  console.log('import boost proof')

  let where = {
    txid: proof.SpentTxid,
    vout: proof.SpentVout
  }

  console.log('find boost job', where)

  let [job] = await pg('boost_jobs').where(where).select('*').limit(1)

  console.log('job', job)

  if (!job) {

    console.log('no job found')
    return
  }

  let [proof_record] = await pg('boost_job_proofs').where({
    job_txid: proof.SpentTxid,
  }).select('*').limit(1)

  if (job.spend_txid && proof_record) {

    console.log(`job already has spend txid ${job.spend_txid}`)

    return proof_record

  } else {

    if (!proof_record) {

      console.log('no proof found')

      proof_record = await pg('boost_job_proofs').insert({
        job_txid: proof.SpentTxid,
        job_vout: proof.SpentVout,
        spend_txid: proof.Txid,
        spend_vout: proof.Vin,
        content: job.content,
        difficulty: job.difficulty,
        inserted_at: new Date(),
        updated_at: new Date()
      })
      .returning('*')

      console.log('job proof record', proof_record)

      events.emit('work.published', proof_record)

    }

    let jobRecord = await models.BoostJob.findOne({
      where: {
        txid: proof.SpentTxid,
        vout: proof.SpentVout
      }
    })

    jobRecord.spend_txid = proof.SpentTxid
    jobRecord.spend_vout = proof.SpentVout
    jobRecord.spent = true

    await jobRecord.save()

    console.log('job record updated', jobRecord.toJSON())

  }

  return proof_record

}

export async function importBoostJob(txid: string) {

  let jobs: BoostJob[] = await getBoostJobsFromTxid(txid)

  return Promise.all(jobs.map(async job => {
    console.log('job', job)

    let [job_record] = await pg('boost_jobs').where({ txid }).returning('*')

    if (job_record && job_record.script) {

      return job_record
    }

    return persistBoostJob(job)

  }))
}

interface NewJob {
  content: string;
  difficulty: number;
  satoshis: number;
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
      console.log('job.created', { txid })

      await delay(2000)

      try {

        let {hex} = await getTransaction(txid)

        let result = await boost.Graph().submitBoostJob(hex);

        console.log('boost.job.submitted', result)

        let newRecord = await importBoostJob(txid)

        console.log('job.imported', newRecord)

      } catch(error) {

        console.error(error)

      }

    })

  } catch(error) {
    console.log(error)

  }

}


