
import * as dotenv from 'dotenv'

dotenv.config()

import fetch from 'node-fetch'

import { createReadStream } from 'fs'

import * as EventSource from 'eventsource'

import * as split2 from 'split2'

import * as through2 from 'through2'

import knex from 'knex'

const pg = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

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


import * as btoa from 'btoa'

(async () => {

  let block = await pg('planaria_records').orderBy('block_height', 'desc').limit(1).returning('block_height')

  const block_height_start = !!block[0] ? block[0]['block_height'] - 100 : 0;
  //const block_height_start = 0

  const query = {
    q: {
      //find: { "out.s2": "relayx.io", "blk.i": { "$gt": 100000 } },
      find: { "out.s0": "boostpow", "blk.i": { "$gt": block_height_start } },
      //sort: { "blk.i": 1 },
      project: { "blk": 1, "tx.h": 1, "out.s4": 1, "out.o1": 1 }
    }
  };
  fetch("https://txo.bitbus.network/block", {
    method: "post",
    headers: {
      'Content-type': 'application/json; charset=utf-8',
      'token': 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxRlRyUWRaRjczd21tSFpVbzRhQzI1a0JWNUprWFRoeGl3IiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SHovaVkvTncvNmI0M1Q4WFZ0Ulk2SHdEMXQzOGM1RHJkVTFoTEYyLzhJeEhGZzJsSDQxeldzRG1vdUttemJPb2pJTXd4aVM5Qk9VNjFQNUhJK2x6bUxNPQ'
    },
    body: JSON.stringify(query)
  })
  .then(async (res) => {
    res.body
      .pipe(split2())
      .pipe(through2(async (chunk, enc, callback) => {
        console.log(chunk.toString())

        let json = JSON.parse(chunk.toString())
        console.log(json) 

        try {

          let record = await pg('planaria_records').where({
            'txid': json['tx']['h']
          }).select('_id')

          if (record.length === 0) {
  
            let record = await pg('planaria_records').insert({
              _id: json['_id'],
              //tx: json,
              txid: json['tx']['h'],
              block_hash: json['blk']['h'],
              block_height: json['blk']['i'],
              time: json['blk']['t'],
              inserted_at: new Date(),
              updated_at: new Date()
            })
            .returning('*')

          }

          console.log('record', record)

        } catch(error) {

          console.error(error.message)

        }


        callback()
      }))
  })

})()

// Base64 encode your bitquery
/*const b64 = btoa(JSON.stringify({
  "v": 3, "q": { "find": {} }
}))

const b64 = btoa(JSON.stringify(query))
// Subscribe
const sock = new EventSource('https://txo.bitsocket.network/s/'+b64)
sock.onmessage = function(e) {
  console.log(sock)
  console.log(e)
}

*/
