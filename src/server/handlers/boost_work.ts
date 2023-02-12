
import { importBoostProofFromTxHex, importBoostProofByTxid} from '../../boost'

import models from '../../models'

import { log } from '../../log'

import { Op } from 'sequelize'

export async function createByTxid(request, hapi) {

  let result = await importBoostProofByTxid(request.params.txid)

  log.debug('api.BoostProofs.createByTxid.result', result)

  return hapi.response(result)

}

export async function index(request, hapi) {

  const where = {
  }

  console.log('QUERY', request.query)

  if (request.query.tag) {
    where['tag'] = request.query.tag
  }

  const limit = request.query.limit || 25;

  const offset = request.query.offset || 0;

  if (request.query.start) {

    where['timestamp'] = {
      [Op.gte]: new Date(request.query.start * 1000)
    }

  }

  if (request.query.end) {

    where['timestamp'] = {
      [Op.lte]: new Date(request.query.end * 1000)
    }
    
  }

  const query = {
    where,
    order: [['timestamp', 'asc']],
    limit,
    offset
  }

  log.info('boostpow.work.query', query)

  let work = await models.BoostWork.findAll(query)

  return { work }

}

export async function create(request, hapi) {

  const tx_hex = request.payload.transaction

  log.info('importBoostProofFromTxHex', {tx_hex})

  let result = await importBoostProofFromTxHex(tx_hex, { trusted: true })

  log.info('importBoostProofFromTxHex.result', { tx_hex, result })

  return hapi.response({ work: result.toJSON() }).code(200)

}

