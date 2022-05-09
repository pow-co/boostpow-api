require('dotenv').config()

import * as http from 'superagent'

import { log } from './log'

interface RpcResponse {
  result: any;
}

class JsonRpc {

  call(method, params): Promise<RpcResponse> {

    return new Promise((resolve, reject) => {
      let request = http
        .post(`https://${process.env.BITCOIND_RPC_HOST}:${process.env.BITCOIND_RPC_PORT}`)
        .auth(process.env.BITCOIND_RPC_USER, process.env.BITCOIND_RPC_PASSWORD)
        /*.timeout({
          response: 5000,  // Wait 5 seconds for the server to start sending,
          deadline: 10000, // but allow 1 minute for the file to finish loading.
        })
        */
        .send({
          method: method,
          params: params || [],
          id: 0
        })
      request
        .end((error, resp) => {
          if (error) { return reject(error) }

          resolve(resp.body);
        });
    });
  }
}

let rpc = new JsonRpc();

export async function call(method, params=[]) {

  return rpc.call(method, params)

}

interface RawTx {
  hex: string;
  json: any;
}

export async function getTransaction(txid: string): Promise<RawTx | null> {

  try {

    let rawtx: any = await call('getrawtransaction', [txid])

    if (!rawtx.result) { throw new Error('transaction not found') }

    let decoded: any = await call('decoderawtransaction', [rawtx.result])

    return {
      hex: rawtx.result,
      json: decoded.result
    }

  } catch(error) {

    log.debug('gettransaction.error', error)

    return null

  }

}

type MerkleProof = any;

export async function getMerkleProof(txid: string): Promise<MerkleProof> {

  let { result } = await call('getmerkleproof', [txid])

  return result

}

type Utxo = any;

export async function listUnspent(address: string): Promise<Utxo[]> {

  let { result } = await call('listunspent', [0, 9999999, [address]])

  return result

}

export async function getTransactionJson(txid: string): Promise<any> {

  let {result}: any = await call('getrawtransaction', [txid, true])

  return result

}

