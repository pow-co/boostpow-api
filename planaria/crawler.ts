
import { EventEmitter } from 'events'

import * as split2 from 'split2'

import * as through2 from 'through2'

const fetch = require('node-fetch')

interface CrawlerParams {
  query: any;
  onTransaction: Function
}

export class Crawler extends EventEmitter{

  query: string;

  onTransaction: Function;

  constructor(params: CrawlerParams) {
    super()
    this.query = params.query
    this.onTransaction = params.onTransaction
  }


  start() {

    fetch("https://txo.bitbus.network/block", {
      method: "post",
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        'token': 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxRlRyUWRaRjczd21tSFpVbzRhQzI1a0JWNUprWFRoeGl3IiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SHovaVkvTncvNmI0M1Q4WFZ0Ulk2SHdEMXQzOGM1RHJkVTFoTEYyLzhJeEhGZzJsSDQxeldzRG1vdUttemJPb2pJTXd4aVM5Qk9VNjFQNUhJK2x6bUxNPQ'
      },
      body: JSON.stringify(this.query)
    })
    .then(async (res) => {
      res.body
        .pipe(split2())
        .pipe(through2(async (chunk, enc, callback) => {
          //console.log(chunk.toString())
          let json = JSON.parse(chunk.toString())

          this.emit('chunk', json)
          await this.onTransaction(json)
          callback()
        }))

     })

    return this

  }

}
