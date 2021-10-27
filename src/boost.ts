
import { getTransaction, call } from './jsonrpc'

import pg from './database'

import * as boost from 'boostpow';

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

  let job = boost.BoostPowJob.fromRawTransaction(tx.hex)

  console.log('job', job)

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

  let where = {
    txid: proof.SpentTxid,
    //spend_txid: null
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

  } else {

    if (!proof_record) {

      console.log('no proof found')

      let record = await pg('boost_job_proofs').insert({
        job_txid: proof.SpentTxid,
        job_vout: proof.SpentVout,
        spend_txid: proof.Txid,
        spend_vout: proof.Vin,
        inserted_at: new Date(),
        updated_at: new Date()
      })
      .returning('*')

      console.log('job proof record', record)

    } else {

      let result = await pg('boost_jobs').where('txid').update({
        spend_txid: proof.SpentTxid,
        spent: true
      })

      console.log(result)

    }

  }

}

export async function importBoostProofFromTxid(txid: string) {

  

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

