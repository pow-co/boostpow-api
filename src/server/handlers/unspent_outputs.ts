
import { run } from '../../run'

import { badRequest } from 'boom'

export async function index(request, hapi) {

  let { address } = await request.params

  let utxos = await run.blockchain.utxos(address)

  return hapi.response({

    utxos

  }).code(200)

}
