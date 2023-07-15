
import { BoostPowJob } from 'boostpow'

import { publish } from 'rabbi'

import * as whatsonchain from './whatsonchain'

import * as bsv from 'bsv'

const delay = require('delay');

import * as boost from 'boostpow';

import models from './models'

import { log } from './log'

import { broadcast } from 'powco'

import config from './config'

import * as http from 'superagent'

import { getSpendingTransaction } from './spends'

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

  return Object.values(boost.transaction.fromTransaction(tx).jobs);
}

export async function fetch(txid: string): Promise<string> {

  const url = `https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`

  let result = await http.get(url)

 // console.log(result)

  if (result.status === 200) {

    return result.text

  }

}

export async function fetchWithRetry({txid, maxRetries, delayPeriod}: {txid: string, maxRetries?: number, delayPeriod?: number}): Promise<string> {

  var txhex;

  for (let i=0; i<maxRetries || 10; i++) {

    console.log('fetch with retry', { attempt: i+1, txid })

    try {

      txhex = await fetch(txid)

    } catch(error) {

      console.error('getBoostJobsFromTxid.error', {txid})

    }

    if (txhex) { break }

    await delay(delayPeriod || 1000)

  }

  return txhex

}

export async function getBoostJobsFromTxid(txid:string): Promise<boost.BoostPowJob[]> {

  const txhex = await fetch(txid)

  return getBoostJobsFromTxHex(txhex)


}

export async function getBoostProofs(txid: string): Promise<{ proofs: Record<number,boost.BoostPowJobProof>, tx_hex: string }> {

  const tx_hex = await fetch(txid)
  let proofs = boost.transaction.fromTransaction(new bsv.Transaction(tx_hex)).redemptions


  return { proofs, tx_hex }

}

export async function persistBoostJob(job: BoostPowJob, tx_hex: string): Promise<BoostJob> {

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

  const jobObject = job.toObject()

  let params = {
    txid: job.txid,
    content: jobObject.content.toString(),
    script: job.toHex(),
    vout: job.vout,
    value: job.value,
    difficulty: job.difficulty,
    category: jobObject.category.toString(),
    tag: jobObject.tag.toString(),
    userNonce: jobObject.userNonce.toString(),
    additionalData: jobObject.additionalData.toString(),
    minerPubKeyHash: typeof jobObject.minerPubKeyHash !== 'undefined' ? jobObject.minerPubKeyHash.toString() : "",
    tx_hex,
    timestamp
  }

  log.info('persistBoostJob', params)

  record = await models.BoostJob.create(params)

  if (config.get('amqp_enabled')) {

    await publish('powco', 'boostpow.job.created', record.toJSON())

  }


  return record

}

export async function getBoostJob(txid: string): Promise<BoostJob> {

  const hex = await fetch(txid)

  let [record] = await models.BoostJob.findOne({
    where: { txid }
  })

  let job = boost.BoostPowJob.fromRawTransaction(hex)

  if (record && !job) {
    return record
  }

  let spent = await getSpendingTransaction({hash: txid, index: job.vout })

  if (spent && !record.spent) {

    record.spent = true
    await record.save()
  }

  return record.toJSON()

}

export async function importBoostProofByTxid(txid: string): Promise<any> {

  const {proofs, tx_hex} = await getBoostProofs(txid)

  if (Object.keys(proofs).length === 0) {
    return
  }

  return importBoostProofs(proofs, tx_hex)

}

export async function importBoostProofFromTxHex(txhex: string): Promise<any> {
  return  _importBoostProofFromTxHex(txhex, {trusted: false})
}

export async function importBoostProofFromTxHexListener(txhex:string): Promise<any> {
  return _importBoostProofFromTxHex(txhex, {trusted: true})
}
async function _importBoostProofFromTxHex(txhex: string, {trusted}: {trusted?: boolean}): Promise<any> {

  log.info('importBoostProofFromTxHex', { txhex, trusted })

  // ensure the transaction is broadcast to the network first

  let tx = new bsv.Transaction(txhex)

  var isBroadcast = false;

  if (!trusted) {

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
    
  }
  let txDetails = boost.transaction.fromTransaction(tx);


  if (!trusted) {

    importBoostProofByTxid(tx.hash)
    
  }

  return importBoostProofs(txDetails.redemptions, txhex)

}

export async function importBoostProofs(proofs: Record<number,boost.BoostPowJobProof>, tx_hex: string): Promise<Record<number,boost.BoostPowJobProof>> { // proof_record

  if (Object.keys(proofs).length===0) { return }

  let proof_records : Record<number,boost.BoostPowJobProof>={}
  Object.keys(proofs).forEach(async (vout) => {
    const curProof = proofs[vout];
    const timestamp = curProof.time ? new Date(curProof.time.number * 1000) : new Date()

    let where = {
      txid: curProof.spentTxid,
      vout: curProof.spentVout
    }
    let job = await models.BoostJob.findOne({
    where
  })
    if (!job) {

    await importBoostJobFromTxid(curProof.spentTxid)

    job = await models.BoostJob.findOne({
      where
    })

    if (!job) {

      return
    }
  

  }
  let proof_record = await models.BoostWork.findOne({
    where: {
      job_txid: curProof.spentTxid
    }
  })
  if(job.spend_txid && proof_record) {
    proof_records[vout] = proof_record
    
  } else {
    if(!proof_record) {
      log.info('boost.importBoostProof.recordNotFound', { spentTxid: curProof.spentTxid })
      proof_record = await models.BoostWork.create({
        job_txid: curProof.spentTxid,
        job_vout: curProof.spentVout,
        spend_txid: curProof.txid,
        spend_vout: curProof.vin,
        content: job.content,
        difficulty: job.difficulty,
        tag: job.tag,
        timestamp,
        value: job.value,
        tx_hex
      })

      if (config.get('amqp_enabled')) {

        publish('powco', 'boostpow.proof.created', proof_record.toJSON());

      }
      job.spent = true;
      job.spent_txid = curProof.txid;
      job.spent_vout = curProof.vin;
      await job.save()
      if (config.get('amqp_enabled')) {


        publish('powco', 'boostpow.job.completed', {
          job: job.toJSON(), proof: proof_record.toJSON()
        })

      }
    }
    let jobRecord = await models.BoostJob.findOne({
      where: {
        txid: curProof.spentTxid,
        vout: curProof.spentVout
      }
    })

    jobRecord.spend_txid = curProof.spentTxid
    jobRecord.spend_vout = curProof.spentVout
    jobRecord.spent = true;
    await jobRecord.save();
  }
  });

  return proof_records

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

  }

  if (!txhex) {

    log.info('txhex.null.fetch', { job_txid: job.txid })

    txhex = await fetch(job.txid)

  }

  return importBoostJobFromTxHex(txhex)

}


export async function importBoostJobFromTxHex(txhex: string) {

  log.info('boost.importBoostJobFromTxhex', { txhex })

  let jobs: BoostPowJob[] = await getBoostJobsFromTxHex(txhex)

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

    return persistBoostJob(job, txhex)

  }))

  return records

}


export async function importBoostJobFromTxid(txid: string) {

  log.info('boost.importBoostJobFromTxid', { txid })

  const txhex = await fetch(txid)

  let jobs: BoostPowJob[] = await getBoostJobsFromTxHex(txhex)

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

    return persistBoostJob(job, txhex)

  }))

  return records

}
