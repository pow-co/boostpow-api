require("dotenv").config()

const EventSource = require('eventsource')

import * as boostpow from 'boostpow'

import * as models from '../models'

const pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

const rabbi = require('rabbi')

import * as powco from '../src/powco'
import * as whatsonchain from '../src/whatsonchain'

import { Crawler } from './crawler'


export async function sync() {

  let block = await pg('planaria_records').orderBy('block_height', 'desc').limit(1).returning('block_height')

  //const block_height_start = !!block[0] ? block[0]['block_height'] - 100 : 0;
  const block_height_start = 0

  const crawler = new Crawler({

    query: {
      q: {
        find: { "out.s0": "boostpow", "blk.i": { "$gt": block_height_start } },
      }
    },

    onTransaction: async (json) => {

      try {

        let record = await pg('planaria_records').where({
          'txid': json['tx']['h']
        }).select('_id')

        if (record.length === 0) {
          //console.log('record not found')

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

          let record = await pg('planaria_records')
            .insert(params)
            .returning('*')

          let channel = await rabbi.getChannel()

          channel.publish('proofofwork', 'boost_job_created', Buffer.from(JSON.stringify(params)))

        }

        let jobRecord = await models.BoostJob.findOne({
          where: { txid: json['tx']['h'] }
        })

        if (!jobRecord) {

          console.log(`JOB NOT FOUND ${json['tx']['h']}`)

          let powcotx = await powco.getTransaction(json['tx']['h'])
          let tx = await whatsonchain.getTransaction(json['tx']['h'])

          console.log(tx)
          console.log(powcotx)

          try {

            let boostjob = boostpow.BoostPowJob.fromTransaction(powcotx)

            console.log('boostjob', boostjob)

            if (boostjob) {

              jobRecord = await models.BoostJob.create({
                content: boostjob.content.hex,
                difficulty: boostjob.difficulty,
                category: boostjob.category.hex,
                tag: boostjob.tag.hex,
                additionalData: boostjob.additionalData.hex,
                userNonce: boostjob.userNonce.hex,
                txid: boostjob.txid,
                vout: boostjob.vout,
                value: boostjob.value,
                timestamp: tx.time

              })

              console.log('boostpow job recorded', jobRecord.toJSON())

            }

          } catch(error) {

            console.error('error', error)
          }


        } else {

          console.log(`YES JOB FOUND ${json['tx']['h']}`)
        }

        //console.log(powcotx)
        //console.log(tx)

      } catch(error) {

        console.error(error.message)

      }

    }
  })

  crawler.start()

}

(async () => {

  await sync()

})()

