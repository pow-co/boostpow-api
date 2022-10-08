
import { getBoostJobsFromTxHex, importBoostJob, importBoostJobFromTxid } from '../../boost'

import { flatten } from 'lodash'

import models from '../../models'

import { log } from '../../log'

import { Op } from 'sequelize'

import { badRequest, notFound } from 'boom'

export async function index(request) {

  const where = {
    spent: false,
    script: {
      [Op.ne]: null
    }
  }

  if (request.query.tag) {
    where['tag'] = request.query.tag
  }

  const limit = request.query.limit || 25;

  let jobs = await models.BoostJob.findAll({
    where,
    order: [['difficulty', 'asc']],
    limit
  })

  return { jobs }

}

export async function show(request, hapi) {

  let { txid } = request.params

  const where = {
    txid
  };

  let job = await models.BoostJob.findOne({ where })

  if (!job) {

    return notFound()

  }

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

  log.info('boost.job.tx.import', { transaction })

  let jobs = getBoostJobsFromTxHex(transaction)

  let records = await Promise.all(jobs.map((job) => importBoostJob(job, transaction)))

  log.info('boost.job.tx.import.response', { records })

  let json = flatten(records).map(record => record.toJSON())

  return hapi.response({ jobs: json }).code(200)

}
