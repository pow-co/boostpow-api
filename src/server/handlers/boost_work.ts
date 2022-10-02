
import { importBoostProofFromTxHex, importBoostProofByTxid} from '../../boost'

import models from '../../models'

import { log } from '../../log'

import { badRequest } from 'boom'

export async function createByTxid(request, hapi) {

  try {

    let result = await importBoostProofByTxid(request.params.txid)

    log.debug('api.BoostProofs.createByTxid.result', result)

    return hapi.response(result)

  } catch(error) {

    log.error('api.BoostProofs.createByTxid', error)

    return badRequest(error)

  }

}

export async function index(request, hapi) {

  const where = {
  }

  if (request.query.tag) {
    where['tag'] = request.query.tag
  }

  try {

    const limit = request.query.limit || 25;

    let work = await models.BoostWork.findAll({
      where,
      order: [['createdAt', 'desc']],
      limit
    })

    return { work }

  } catch(error) {

    return hapi.response({ error: error.message }).code(500)

  }

}

export async function create(request, hapi) {

  try {

    const tx_hex = request.payload.transaction

    log.info('importBoostProofFromTxHex', {tx_hex})

    let result = await importBoostProofFromTxHex(tx_hex)

    log.info('importBoostProofFromTxHex.result', { tx_hex, result })

    return hapi.response({ work: result.toJSON() }).code(200)

  } catch(error) {

    log.error.error('importBoostProofFromTxHex.error', error)

    return hapi.response({ error: error.message }).code(500)

  }

}
