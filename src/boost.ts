
import { getTransaction, call } from './jsonrpc'

import { BoostPowJob } from 'boostpow'

import { publish } from 'rabbi'

import * as whatsonchain from './whatsonchain'

import * as bsv from 'bsv'

const delay = require('delay');

import * as boost from 'boostpow';

import models from './models'

import { log } from './log'

import { fetch, broadcast } from 'powco'

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

export function getBoostJobsFromTxHex(txhex: string): boost.BoostPowJob[] {

  const tx = new bsv.Transaction(txhex)

  var index = 0
  var jobs: boost.BoostPowJob[] = []

  for (let output of tx.outputs) {

    let job = boost.BoostPowJob.fromTransaction(txhex, index)

    index +=1

    if (job) { jobs.push(job) }

  }
  
  return jobs

}

export async function getBoostJobsFromTxid(txid:string): Promise<boost.BoostPowJob[]> {

  const txhex = await fetch(txid)

  const tx = new bsv.Transaction(txhex)

  var i = 0;

  let jobs: boost.BoostPowJob[] = tx.outputs.reduce((jobs, vout) => {

    let job = boost.BoostPowJob.fromRawTransaction(txhex, i)

    if (job) { jobs.push(job) }

    i++

    return jobs

  }, [])

  return jobs

}

export async function getBoostProof(txid: string): Promise<any> {

  const hex = await fetch(txid)

  let proof = boost.BoostPowJobProof.fromRawTransaction(hex)

  return proof

}

export async function persistBoostJob(job: BoostPowJob): Promise<BoostJob> {

  let record = await models.BoostJob.findOne({
    where: { txid: job.txid }
  })

  if (record) {
    return record
  }

  var timestamp;

  if (!timestamp) {

    const result = await whatsonchain.getTransaction(job.txid)

    timestamp = result.time
  }

  if (!timestamp) {

    timestamp = new Date()
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
    timestamp
  }

  record = await models.BoostJob.create(params)

  await publish('powco', 'boostpow.job.created', record.toJSON())

  return record

}

export async function getBoostJob(txid: string): Promise<BoostJob> {

  const hex = await fetch(txid)

  console.log('FETCH', hex)

  let [record] = await models.BoostJob.findOne({
    where: { txid }
  })

  let job = boost.BoostPowJob.fromRawTransaction(hex)

  if (record && !job) {
    return record
  }

  let spent = await checkBoostSpent(txid, job.vout)

  if (spent && !record.spent) {

    record.spent = true
    await record.save()
  }

  return record.toJSON()

}

export async function checkBoostSpent(txid: string, vout: number): Promise<boolean> {

  let {result}: any = await call('gettxout', [txid, vout])

  return !result

}

export async function importBoostProofByTxid(txid: string): Promise<any> {

  const proof = await getBoostProof(txid)

  if (!proof) {
    return
  }

  return importBoostProof(proof)

}

export async function importBoostProofFromTxHex(txhex: string): Promise<any> {

  // ensure the transaction is broadcast to the network first

  let tx = new bsv.Transaction(txhex)

  var isBroadcast = false;

  try {

    const result = await fetch(tx.hash)

    isBroadcast = !!result

  } catch(error) {

    log.debug('powco.fetch.error', error)

  }
 
  if (!isBroadcast) {
    
    try {

      log.info('powco.broadcast', { txhex })

      //broadcast transaction
      await broadcast(txhex)

      log.info('powco.broadcast.response', { txhex, txid: tx.hash })

    } catch(error) {

      log.error('powco.broadcast.error', error)

      throw error

    }

  }

  let proof = boost.BoostPowJobProof.fromRawTransaction(txhex)

  importBoostProofByTxid(tx.hash)

  return importBoostProof(proof)

}

export async function importBoostProof(proof: boost.BoostPowJobProof): Promise<any> {

  if (!proof) { return }

  console.log('importboostproof', proof)

  let where = {
    txid: proof.spentTxid,
    vout: proof.spentVout
  }

  let job = await models.BoostJob.findOne({
    where
  })

  if (!job) {

    await importBoostJobFromTxid(proof.spentTxid)

    job = await models.BoostJob.findOne({
      where
    })

    if (!job) {

      return
    }

  }

  let proof_record = await models.BoostWork.findOne({
    where: {
      job_txid: proof.spentTxid
    }
  })

  if (job.spend_txid && proof_record) {

    return proof_record

  } else {

    if (!proof_record) {

      proof_record = await models.BoostWork.create({
        job_txid: proof.spentTxid,
        job_vout: proof.spentVout,
        spend_txid: proof.txid,
        spend_vout: proof.vin,
        content: job.content,
        difficulty: job.difficulty,
        tag: job.tag,
        timestamp: new Date(),
        value: job.value
      })

      publish('powco', 'boostpow.proof.created', proof_record.toJSON());

      job.spent = true;
      job.spent_txid = proof.txid;
      job.spent_vout = proof.vin;
      await job.save()

      publish('powco', 'boostpow.job.completed', {
        job: job.toJSON(), proof: proof_record.toJSON()
      })

    }

    let jobRecord = await models.BoostJob.findOne({
      where: {
        txid: proof.spentTxid,
        vout: proof.spentVout
      }
    })

    jobRecord.spend_txid = proof.spentTxid
    jobRecord.spend_vout = proof.spentVout
    jobRecord.spent = true

    await jobRecord.save()

  }

  return proof_record

}

export async function importBoostJob(job: BoostPowJob, txhex?: string) {

  log.info('importBoostJob', {job, txhex})

  let record = await models.BoostJob.findOne({
    where: {
      txid: job.txid,
      vout: job.vout
    }
  })

  if (record) {

    return record

  } else {

    let hex = await fetch(job.txid)

    if (!hex) {

      let response = await broadcast(txhex)

      log.info('broadcast.response', response)

    }

    return importBoostJobFromTxid(job.txid)

  }

}

export async function importBoostJobFromTxid(txid: string) {

  let jobs: BoostPowJob[] = await getBoostJobsFromTxid(txid)

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

    let result = await persistBoostJob(job)

    return result;

  }))

  return records
}
