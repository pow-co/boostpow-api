

import { run } from '../../run'

export async function show(request, hapi) {

  let txhex = await run.blockchain.fetch(request.params.txid)

  return hapi.response({

    txhex

  }).code(200)

}

import { log } from '../../log'

import { badRequest } from 'boom'

export async function create (req, h) {

  const { transaction } = req.payload

  log.info('api.transactions.create', { transaction })

  try {

    let txid = await run.blockchain.broadcast(transaction)

    log.info('run.blockchain.broadcast.result', { transaction, txid })

    return { payment: transaction }

  } catch(error) {

    log.debug('run.blockchain.broadcast.error', { transaction, error })

    log.error('run.blockchain.broadcast', error)

    return badRequest(error)

  }

}

