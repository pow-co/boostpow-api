
import { log } from '../../log'

import { call as rpc } from '../../jsonrpc'

export async function create(request, hapi) {

  const { rawtx } = request.payload

  log.info('mapi.tx.submit', request.payload)

  try {

    let response = await rpc('sendrawtransaction', [rawtx])

    log.info('mapi.tx.submit.rpc.response', { response, rawtx })

    return hapi.response(response).code(201)

  } catch({ response }) {

    const json = JSON.parse(response.text)

    log.error('mapi.transact.submit.error', json) 

    return hapi.response({ error: json.error }).code(400)

  }

}

