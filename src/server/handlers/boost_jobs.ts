import { Transaction } from 'bsv'

import { getBoostJobsFromTx, importBoostJob, importBoostJobFromTxid } from '../../boost'

import { flatten } from 'lodash'

import * as models from '../../models'

import { log } from '../../log'

import { Op } from 'sequelize'

export async function index(request, hapi) {

  try {

    const limit = request.query.limit || 25;

    let jobs = await models.BoostJob.findAll({
      where: {
        spent: false,
        script: {
          [Op.ne]: null
        }
      },
      order: [['difficulty', 'asc']],
      limit
    })

    return { jobs }

  } catch(error) {

    return hapi.response({ error: error.message }).code(500)

  }

}

export async function spent(request, hapi) {

  try {

    const limit = request.query.limit || 25;

    let jobs = await models.BoostJob.findAll({
      where: {
        spent: true,
        script: {
          [Op.ne]: null
        }
      },
      order: [['createdAt', 'desc']],
      limit
    })

    return { jobs }

  } catch(error) {

    return hapi.response({ error: error.message }).code(500)

  }

}

export async function show(request, hapi) {

  try {

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

  } catch(error) {

    console.error(error)

    return hapi.response({ error }).code(500)

  }

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

  const tx = new Transaction(transaction)

  let jobs = await getBoostJobsFromTx(tx)

  let records = await Promise.all(jobs.map((job) => importBoostJob(job, transaction)))

  let json = flatten(records).map(record => record.toJSON())

  return hapi.response({ jobs: json }).code(200)

}

