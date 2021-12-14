
import * as http from 'superagent'
import * as bsv from 'bsv'

export async function submitBoostProofTransaction(hex: string): Promise<any> {

  let { body } = http.post('https://pow.co/node/api/boost_proof_transactions')
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

  console.log('LIST AVAILABLE')

  let { body } = await http.get('https://pow.co/api/v1/jobs')

  console.log(body)

  return body.jobs.map(job => {
    return Object.assign(job, { difficulty: parseFloat(job.difficulty) })
  })
  .sort((a,b) => a.difficulty <= b.difficulty)

}

export async function getTransaction(txid: string): Promise<bsv.Transaction> {

  let { body } = await http.get(`https://pow.co/api/v1/tx/${txid}`)

  return new bsv.Transaction(body.txhex)

}

