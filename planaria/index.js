require("dotenv").config()

const fetch = require('node-fetch')

const { createReadStream } = require('fs')

const EventSource = require('eventsource')

const split2 = require('split2')

const through2 = require('through2')

const pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

const rabbi = require('rabbi')

const http = require('superagent')

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

async function getTransaction(txid) {

  let rawtx = await call('getrawtransaction', [txid])

  let decoded = await call('decoderawtransaction', [rawtx.result])

  return {
    hex: rawtx.result,
    json: decoded.result
  }
}


var btoa = require('btoa');

async function sync() {

  console.log("SYNC")

  //let block = await pg('planaria_records').orderBy('block_height', 'desc').limit(1).returning('block_height')

  //const block_height_start = !!block[0] ? block[0]['block_height'] - 100 : 0;
  const block_height_start = 0

  const query = {
    q: {
      find: { "out.s0": "boostpow", "blk.i": { "$gt": block_height_start } },
      //find: { "out.s2": "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAutN", "blk.i": { "$gt": block_height_start } },
      //find: { "out.s0": "boostpow", "blk.i": { "$gt": 100000 } },
      //sort: { "blk.i": 1 },
      //project: { "blk": 1, "tx.h": 1, "out.s4": 1, "out.o1": 1 }
    }
  };

  console.log({ query })
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
        //console.log(chunk.toString())

        let json = JSON.parse(chunk.toString())
        //console.log(json['tx']['h']) 

        try {

          let record = await pg('planaria_records').where({
            'txid': json['tx']['h']
          }).select('_id')

          if (record.length === 0) {
            console.log('record not found')

            let params = {
              _id: json['_id'],
              //tx: tx.json,
              txid: json['tx']['h'],
              block_hash: json['blk']['h'],
              block_height: json['blk']['i'],
              time: json['blk']['t'],
              inserted_at: new Date(),
              updated_at: new Date()
            }

            try {


              //params['rawtx'] = Buffer.from(tx.hex)

            } catch(error) {

              console.error(error)

            }

            let record = await pg('planaria_records')
              .insert(params)
              .returning('*')

            let channel = await rabbi.getChannel()

            channel.publish('proofofwork', 'boost_job_created', Buffer.from(JSON.stringify(params)))

          }

          let tx = await getTransaction(json['tx']['h'])

          console.log(tx)

          console.log('record', record)

        } catch(error) {

          console.error(error.message)

        }


        callback()
      }))
  })

}

(async () => {

  await sync()

})()

module.exports.sync = sync
