require("dotenv").config()

const EventSource = require('eventsource')

import * as boostpow from 'boostpow'

import models from '../src/models'

import * as rabbi from 'rabbi'

import * as powco from '../src/powco'

import * as whatsonchain from '../src/whatsonchain'

//import { Crawler } from '../src/bitbus_crawler'
import { Crawler } from './crawler'

import { log } from '../src/log'

type PlanariaJSON = any;

async function handlePlanariaJSON(json: PlanariaJSON) {

  try {

    // for each transaction get the full transaction from blockchain provider
    let powcotx = await powco.getTransaction(json['tx']['h'])
    let tx = await whatsonchain.getTransaction(json['tx']['h'])

    // for each output in the transaction attempt to parse boost job
    //
    let entries = Array.from(powcotx.outputs.entries())

    let jobs = entries.map(([index, output]) => {

      return boostpow.BoostPowJob.fromTransaction(powcotx, index)

    }).filter(job => !!job)

    for (let job of jobs) {

      console.log({ job })

      // for each boost job parsed, query the database for a job at that txid and vout
      // when a boost job is not found in the database record that job
      let [record, isNew] = await models.BoostJob.findOrCreate({
        where: {
          txid: job.txid,
          vout: job.vout
        },
        defaults: {
          content: job.content.hex,
          difficulty: job.difficulty,
          category: job.category.hex,
          tag: job.tag.hex,
          additionalData: job.additionalData.hex,
          userNonce: job.userNonce.hex,
          txid: job.txid,
          vout: job.vout,
          value: job.value,
          timestamp: tx.time,
          script: job.toHex()
        }
      })
      console.log({ record: record.toJSON(), isNew })

      if (isNew) {
        // when a new boost job is recorded in the database, publish an event to rabbi

        log.info('boost.job.recorded', { job: job.toObject(), record: record.toJSON() })

      }

    }

  } catch(error) {

    console.error(error.message)

  }

}

export async function sync() {

  //let block = await pg('planaria_records').orderBy('block_height', 'desc').limit(1).returning('block_height')

  //const block_height_start = !!block[0] ? block[0]['block_height'] - 100 : 0;
  const block_height_start = 0

  const crawler = new Crawler({

    query: {
      q: {
        find: { "out.s0": "boostpow", "blk.i": { "$gt": 738000 } },
      }
    },

    onTransaction: (json) => {

      //log.info('planaria.json', json)

      return handlePlanariaJSON(json)

    }
  })

  crawler.start()

}

(async () => {

  await sync()

})()

