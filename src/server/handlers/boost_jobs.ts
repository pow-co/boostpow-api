
import { getBoostJobsFromTxHex, importBoostJob, importBoostJobFromTxid } from '../../boost'

import { flatten } from 'lodash'

import models from '../../models'

import { log } from '../../log'

import { Op } from 'sequelize'

import { notFound } from 'boom'

import config from '../../config'

import { BoostPowJob } from 'boostpow'

import moment from 'moment'

import { quoteDifficulty } from '../../prices'

import { badRequest } from 'boom'

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

  if (request.query.maxDifficulty) {
    where['difficulty'] = {
      [Op.lte]: request.query.maxDifficulty
    }
  }
  if (request.query.minDifficulty) {

    if (where['difficulty']) {

      where['difficulty'] = Object.assign(where['difficulty'], {
        [Op.gte]: request.query.minDifficulty
      })

    } else {

      where['difficulty'] = {
        [Op.gte]: request.query.minDifficulty
      }

    }

  }

  where['profitability'] = {
    [Op.gt]: 0
  }

  const limit = request.query.limit || 25;

  let jobs = await models.BoostJob.findAll({
    where,
    order: [['profitability', 'desc']],
    limit
  })

  return { jobs }

}

export async function show(request, hapi) {

  try {

    let { txid: location } = request.params

    const [txid, vout] = location.split('_')

    const where = {
      txid
    };

    if (vout) {

      where['vout'] = vout
    }

    let jobs = await models.BoostJob.findAll({ where })

    if (jobs.length == 0) {

      jobs = await importBoostJobFromTxid(txid)

    }

    let [job] = jobs

    if (!job) {

      return notFound()

    }

    if (!vout && job.spent) {

      where['spent'] = false

      let unspent = await models.BoostJob.findOne({ where })

      if (unspent) { job = unspent }

    }

    return hapi.response({ job, jobs }).code(200)

  } catch(error) {

    console.error('server.handlers.boost_jobs.show.error', error)

    return badRequest(error)
    
  }


}

export async function createByTxid(request) {

  try {

    const { txid } = request.params

    log.info('server.handlers.boost_jobs.createByTxid', { txid })

    let jobs = await importBoostJobFromTxid(request.params.txid)

    let [job] = jobs

    return { job, jobs }

  } catch(error) {

    log.error('server.handlers.boost_jobs.createdByTxid.error', error)
    console.log(error)

    return badRequest(error)

  }

}

export async function create(request, hapi) {

  // parse job transaction
  // look up on by txid blockchain
  // if not on chain, broadcast then import

  try {

    const { transaction } = request.payload

    log.info('boost.job.tx.import', { transaction })

    let jobs = getBoostJobsFromTxHex(transaction)

    log.info('getBoostJobsFromTxHex.result', jobs)

    let records = await Promise.all(jobs.map((job) => importBoostJob(job, transaction)))

    log.info('boost.job.tx.import.response', { records })

    let json = flatten(records).map(record => record.toJSON())

    return hapi.response({ jobs: json }).code(200)

  } catch(error) {

    log.error('boost.job.tx.import.error', error)

    return { jobs: [] }

  }

}

function isHex(num) {
  return Boolean(num.match(/^0x[0-9a-f]+$/i))
}


export async function build(req) {

  try {

    var { currency, value, difficulty, category, tag } = req.query

    const { satoshis: amount, difficulty: diff } = await quoteDifficulty({ currency, value, difficulty })

    if (category && !isHex(category)) {

      category = Buffer.from(category, 'utf8').toString('hex')

    }

    if (tag && !isHex(tag)) {

      tag = Buffer.from(tag, 'utf8').toString('hex')

    }

    const newJob = {

      content: req.params.tx_id,

      diff

    }

    if (tag) {

      newJob['tag'] = tag

    }

    if (category) {

      newJob['category'] = category

    }

    const script = BoostPowJob.fromObject(newJob).toHex()

    const payment_request = {
      network: 'bitcoin-sv',
      memo: `BoostPOW ${difficulty} Difficulty`,
      merchantData: JSON.stringify({
        avatarUrl: 'https://media.twetch.app/dyt/256x256/545af7c1e4e2453c164306c62fe9555e8599819d8751720763c0fd567f4ce784.png'
      }),
      creationTimestamp: moment().unix(),
      expirationTimestamp: moment().add(1, 'hour').unix(),
      paymentUrl: `${config.get('api_base')}/api/v1/transactions`,
      outputs: [{
        script,
        amount
      }]
    }

    log.debug('boostpow.new', { payment_request })

    return payment_request

  } catch(error){ 

    console.error(error)

    return badRequest(error)

  }

}
