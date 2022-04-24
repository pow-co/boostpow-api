import { Transaction } from 'bsv'

import { getBoostJobsFromTx, importBoostJob, importBoostJobFromTxid } from '../../boost'

import { flatten } from 'lodash'

import * as models from '../../models'

export async function show(request, hapi) {

  let { txid } = request.params

  const where = {
    txid
  };

  if (txid.match('_')) {

    const vout = txid.split('_')[1]

    where['vout'] = txid.split('_')[1]

  }

  let job = await models.BoostJob.findOne({ where })

  return hapi.response({ job: job.toJSON() }).code(200)

}

export async function createByTxid(request, hapi) {

  let job = await importBoostJobFromTxid(request.params.txid)

  return { job }

}

export async function create(request, hapi) {

  // parse job transaction
  // look up on by txid blockchain
  // if not on chain, broadcast then import

  const { transaction } = request.payload

  console.log("boost.job.tx.import", transaction)

  const tx = new Transaction(transaction)

  let jobs = await getBoostJobsFromTx(tx)

  let records = await Promise.all(jobs.map((job) => importBoostJob(job, transaction)))

  let json = flatten(records).map(record => record.toJSON())

  return hapi.response({ jobs: json }).code(200)

}

