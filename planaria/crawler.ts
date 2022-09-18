
import { EventEmitter } from 'events'

import * as split2 from 'split2'

import * as through2 from 'through2'

import { log } from '../src/log'

import delay from 'delay'

const fetch = require('node-fetch')

const planaria_token = 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxRlRyUWRaRjczd21tSFpVbzRhQzI1a0JWNUprWFRoeGl3IiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SHovaVkvTncvNmI0M1Q4WFZ0Ulk2SHdEMXQzOGM1RHJkVTFoTEYyLzhJeEhGZzJsSDQxeldzRG1vdUttemJPb2pJTXd4aVM5Qk9VNjFQNUhJK2x6bUxNPQ'

export interface CrawlerParams {

  query: any;

  onTransaction: Function;
  
  interval?: number;

  block_index_start?: number;

}

export interface BitbusBlock {

  i: number;

  h: string;

  t: number;

}

export interface BitbusMessage {

  _id: string;

  tx: any;

  in: any[];

  out: any[];
  
  lock: number;

  i: number;

  blk: BitbusBlock;

}

export class Crawler extends EventEmitter {

  query: string;

  onTransaction: Function;

  interval: number;

  latestBlock: BitbusBlock;

  block_index_start: number;

  constructor(params: CrawlerParams) {

    super()

    this.query = params.query

    this.onTransaction = params.onTransaction

    this.interval = params.interval || 5_200;

    this.block_index_start = params.block_index_start || 0;

  }

  async start() {

    log.info('crawler.planaria.bitbus.boostpow.jobs.start', {query: this.query})

    while (true) {

      await this.runOnceFromStart()

      await delay(this.interval)

    }

  }

  runOnceFromStart() {

    log.debug('crawler.planaria.sync', { latestBlock: this.latestBlock })

    return new Promise((resolve) => {

      const results = []

      const block_index = this.latestBlock ? this.latestBlock.i : this.block_index_start

      const body = JSON.stringify({

        q: {

          find: Object.assign(this.query, {

            "blk.i": {

              "$gt": block_index

            }
          })

        }

      })

      return fetch("https://txo.bitbus.network/block", {

        method: "post",

        headers: {

          'Content-type': 'application/json; charset=utf-8',

          'token': planaria_token

        },

        body

      })
      .then(async (res) => {

        return res.body

          .pipe(split2())

          .pipe(through2(async (chunk, enc, callback) => {
  
            let json: BitbusMessage = JSON.parse(chunk.toString())
  
            this.emit('chunk', json)

            log.debug('crawler.planaria.sync.chunk', json)

            let result = await this.onTransaction(json)

            results.push(result)

            this.latestBlock = json.blk;

            this.emit('latestBlock', this.latestBlock)

            callback()

          }))

          .on('finish', () => {

            log.debug('crawler.planaria.sync.finish', {

              results_count: results.length
              
            })

            this.emit('synced', results)

            resolve(results)

          })
  
       })

    })

  }


}
