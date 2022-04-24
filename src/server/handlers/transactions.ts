
import { getTransaction, getMerkleProof } from '../../jsonrpc'

export async function show(request, hapi) {

  let { hex: txhex, json: txjson } = await getTransaction(request.params.txid)

  let merkleproof = await getMerkleProof(request.params.txid)

  return hapi.response({

    txhex, txjson, merkleproof

  }).code(200)

}

