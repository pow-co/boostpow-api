
import { importBoostProofFromTxHex, importBoostProofByTxid} from '../../boost'

import models from '../../models'

import { log } from '../../log'

export async function createByTxid(request, hapi) {

  let result = await importBoostProofByTxid(request.params.txid)

  log.debug('api.BoostProofs.createByTxid.result', result)

  return hapi.response(result)

}

export async function index(request, hapi) {

  const where = {
  }

  if (request.query.tag) {
    where['tag'] = request.query.tag
  }

  const limit = request.query.limit || 25;

  let work = await models.BoostWork.findAll({
    where,
    order: [['createdAt', 'desc']],
    limit
  })

  return { work }

}

export async function create(request, hapi) {

  const tx_hex = request.payload.transaction

  log.info('importBoostProofFromTxHex', {tx_hex})

  let result = await importBoostProofFromTxHex(tx_hex)

  log.info('importBoostProofFromTxHex.result', { tx_hex, result })

  return hapi.response({ work: result.toJSON() }).code(200)

}
