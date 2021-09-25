
import * as http from 'superagent'

class JsonRpc {

  call(method, params) {

    return new Promise((resolve, reject) => {
      http
        .post(`54.174.1.24:9332`)
        .auth('CHANGE_ME', 'CHANGE_ME')
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
        .end((error, resp) => {
          if (error) { return reject(error) }
          resolve(resp.body);
        });
    });
  }
}

let rpc = new JsonRpc();

async function call(method, params=[]) {

  return rpc.call(method, params)

}

interface RawTx {
  hex: string;
  json: any;
}

export async function getTransaction(txid: string): Promise<RawTx> {

  let rawtx: any = await call('getrawtransaction', [txid])

  let decoded: any = await call('decoderawtransaction', [rawtx.result])

  return {
    hex: rawtx.result,
    json: decoded.result
  }
}

