
import { getTransaction, getMerkleProof } from '../../jsonrpc'

import { run } from '../../run'

export async function show(request, hapi) {

  let txhex = await run.blockchain.fetch(request.params.txid)

  return hapi.response({

    txhex

  }).code(200)

}

