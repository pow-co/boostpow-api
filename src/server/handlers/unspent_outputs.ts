
import { listUnspent } from '../../jsonrpc'

export async function index(request, hapi) {

  let { address } = await request.params

  let utxos = await listUnspent(address)

  return hapi.response({

    utxos

  }).code(200)

}

