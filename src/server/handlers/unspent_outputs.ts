
import { run } from '../../run'

export async function index(request, hapi) {

  let { address } = await request.params

  let utxos = await run.blockchain.unspent(address)

  return hapi.response({

    utxos

  }).code(200)

}
