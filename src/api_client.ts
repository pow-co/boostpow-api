
export const API_BASE = 'https://pow.co/api/v1'

import * as boostpow from 'boostpow'

const axios = require('axios')

export async function getBoostJob(txid: string)  {

  let { data } = await axios.get(`${API_BASE}/boost/jobs/${txid}`)

  return data.job

}

export async function buildBoostJob(params: any)  {

  let { data } = await axios.post(`${API_BASE}/boost/scripts`, params)

  return data.script.hex

}

export async function submitBoostJobTx(transaction: string)  {

  let { data } = await axios.post(`${API_BASE}/boost/jobs`, { transaction })

  return data

}

export async function buildBoostJobTransaction(job: boostpow.BoostPowJob, wallet)  {

  let { data } = await axios.post(`${API_BASE}/boost/transactions`, job.toObject())

  return data

}

