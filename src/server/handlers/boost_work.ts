
import { importBoostProofFromTxHex, importBoostProofByTxid} from '../../boost'

import * as models from '../../models'

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

    let record = await importBoostProofFromTxHex(request.payload.transaction)

    console.log('importboostprooffromtxhex.result', record)

    return hapi.response({ work: record.toJSON() }).code(200)

  } catch(error) {

    console.error('importboostprooffromtxhex.error', error)

    return hapi.response({ error: error.message }).code(500)

  }

}

