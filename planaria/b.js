require("dotenv").config()

const fetch = require('node-fetch')

const split2 = require('split2')
const through2 = require('through2')

const pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

(async () => {

  let result = await pg.raw("select txo->'blk'->>'i' as height from \"BTransactions\" order by id desc limit 1;")

  let blockHeight = parseInt(result.rows[0]['height']) - 1

  const query = {
    q: {
      find: { "out.s2": "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut", "blk.i": { "$gt": blockHeight } },
      sort: { "blk.i": 1 },
      project: { "blk": 1, "tx.h": 1, "out.s3": 1, "out.s4": 1, "out.s5": 1, "out.s6": 1 }
    }
  };

  let res = await fetch("https://txo.bitbus.network/block", {
    method: "post",
    headers: {
      'Content-type': 'application/json; charset=utf-8',
      'token': 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxRlRyUWRaRjczd21tSFpVbzRhQzI1a0JWNUprWFRoeGl3IiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SHovaVkvTncvNmI0M1Q4WFZ0Ulk2SHdEMXQzOGM1RHJkVTFoTEYyLzhJeEhGZzJsSDQxeldzRG1vdUttemJPb2pJTXd4aVM5Qk9VNjFQNUhJK2x6bUxNPQ'
    },
    body: JSON.stringify(query)
  })


  res.body
    .pipe(split2())
    .pipe(through2(async (chunk, enc, callback) => {

      try {

        let json = JSON.parse(chunk.toString())

        console.log(json)

        let bRef = {
          txid: json['tx']['h'],
          contentType: json.out[0]['s4'],
          encoding: json.out[0]['s5'],
          fileName: json.out[0]['s6'],
          txo: json
          //content: json.out[0]['s3']
        }

        await pg('BTransactions')
          .insert(Object.assign(bRef, {
            createdAt: new Date(),
            updatedAt: new Date()
          }))
          //.onConflict('txid')
          //.ignore()
          .returning('*')
          .then(console.log)
          .catch(console.error)

      } catch(error) {

        console.error(error)

      } finally {

        callback()

      }

    }))


})()

