
import { log } from '../../log'

import { run } from '../../run'

export async function create(request, hapi) {

  const { rawtx } = request.payload

  log.info('mapi.tx.submit', request.payload)

  try {

    let txid = await run.blockchain.broadcast(rawtx)

    log.info('mapi.tx.submit.rpc.response', { txid, rawtx })

    return hapi.response({

      txid,
      
      txhex: rawtx

    }).code(201)

  } catch({ response }) {

    const json = JSON.parse(response.text)

    log.error('mapi.transact.submit.error', json) 

    return hapi.response({ error: json.error }).code(400)

  }

}

