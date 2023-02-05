
import * as http from 'superagent'
import * as bsv from 'bsv'

import { run } from './run'

export async function submitBoostProofTransaction(hex: string): Promise<any> {

  let { body } = http.post('https://pow.co/node/api/boost_proof_transactions')
      .send({ transaction: hex })

  return body

}

export async function submitJobTransaction(hex: string): Promise<any> {

  let { body } = http.post('https://pow.co/node/api/boost_job_transactions')
      .send({ transaction: hex })

  return body

}

interface Job {
  content: string;
  difficulty: number;
  category: string;
  tag: string;
  txid: string;
  value: number;
  vout: number;
  additionalData: string;
  script: string;
  spent: boolean;
}

export async function listAvailableJobs(): Promise<Job[]> {

  let { body } = await http.get('https://pow.co/api/v1/jobs')

  return body.jobs.map(job => {
    return Object.assign(job, { difficulty: parseFloat(job.difficulty) })
  })
  .sort((a,b) => a.difficulty <= b.difficulty)

}

export async function getTransaction(txid: string): Promise<bsv.Transaction> {

  const hex = await run.blockchain.fetch(txid)

  return new bsv.Transaction(hex)

}

export async function getTransactionHex(txid: string): Promise<string> {

  return await run.blockchain.fetch(txid)

}

export function importPowcoWebsocketsStream({ url }: { url?: string }) {

  if (!url) { url = 'wss://pow.co' }

}

