require('dotenv').config()

import * as http from 'superagent'

interface RpcResponse {
  result: any;
}

class JsonRpc {

  call(method, params): Promise<RpcResponse> {

    return new Promise((resolve, reject) => {
      let request = http
        .post(`${process.env.BITCOIND_RPC_HOST}:${process.env.BITCOIND_RPC_PORT}`)
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

export async function getTransaction(txid: string): Promise<RawTx> {

  let rawtx: any = await call('getrawtransaction', [txid])

  if (!rawtx.result) { throw new Error('transaction not found') }

  let decoded: any = await call('decoderawtransaction', [rawtx.result])

  return {
    hex: rawtx.result,
    json: decoded.result
  }
}

