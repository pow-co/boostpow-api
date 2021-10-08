
import { getTransaction, call } from './jsonrpc'

import pg from './database'

import * as boost from '/Users/zyler/github/ProofOfWorkCompany/boostpow-js';

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

export async function getBoostJob(txid: string): Promise<BoostJob> {

  let tx = await getTransaction(txid)

  let job = boost.BoostPowJob.fromRawTransaction(tx.hex)

  console.log(job)

  let spent = await checkBoostSpent(txid, job.vout)

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

export async function importBoostJob(txid: string) {

  let [job_record] = await pg('boost_jobs').where({ txid }).returning('*')

  if (job_record && job_record.script) {

    return job_record
  }

  let job: BoostJob = await getBoostJob(txid)

  let params = Object.assign(job, {
    updated_at: new Date(),
  })

  var newRecord;

  if (!job_record) {

    params['inserted_at'] = new Date()

    newRecord = await pg('boost_jobs').insert(params).returning('*')

  } else {

    newRecord = await pg('boost_jobs').update(params).where({
      txid
    }).returning('*')


  }

  return newRecord
}
