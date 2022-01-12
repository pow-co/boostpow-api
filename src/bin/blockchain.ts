#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'
import { call } from '../jsonrpc'

const db = require('../../models')

const redis = require('async-redis')

const cache = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

const delay = require('delay')

class BlockchainProcessor {
  currentHeight: number;

  constructor(currentHeight: number = 0) {
    this.currentHeight = currentHeight
  }
  async incrementHeight() {

    let height = this.currentHeight
    await cache.set('blockheight', height + 1)
    this.currentHeight = height + 1
  }

  async processBlocks() {

    while (true) {

      let height = this.currentHeight

      try {

        await this.processBlock()

        await this.incrementHeight()

      } catch(error) {

        await delay(2000)

      }

    }
  }

  async processBlock() {

    let height = this.currentHeight

    console.log('processblock', { height })

    let {result: hash}= await call('getblockhash', [height])

    let {result: block} = await call('getblock', [hash])

    for (let txid of block['tx']) {

      try {

        let {result: tx} = await call('getrawtransaction', [txid, true])

        console.log(tx)

        let [transaction] = await db.Transaction.findOrCreate({
          where: { txid },
          defaults: {
            txid,
            time: tx.time,
            blockhash: tx.blockhash,
            block_height: height
          }
        })

        console.log(transaction.toJSON())

        for (let vin of tx['vin']) {

          try {

            console.log('HEIGHT', height)

            let [transaction_input, isNew] = await db.TransactionInput.findOrCreate({
              where: { txid, input_txid: vin['txid'], input_index: vin['vout'] },
              defaults: {
                txid,
                input_txid: vin['txid'],
                input_index: vin['vout'],
                block_height: height,
                block_hash: tx.blockhash
              }
            })

            if (!isNew && !transaction_input.block_height) {
              transaction_input.block_height = height;
              transaction_input.block_hash = tx.blockhash
              await transaction_input.save()
            }

            console.log(transaction_input.toJSON())

          } catch(error) {

          }

        }

      } catch(error) {
        console.error(error)

      }

    }

  }
}

program
  .command('getblock <height>')
  .action(async (height) => {

    try {

      let {result: hash}= await call('getblockhash', [parseInt(height)])

      let {result: block} = await call('getblock', [hash])

      console.log(block)

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('processblocks')
  .action(async () => {

    try {

      let height = await cache.get('blockheight')

      console.log('cache', height)

      let processor = new BlockchainProcessor(parseInt(height))

      processor.processBlocks()

    } catch(error) {

      console.error(error)

    }

  })

program
  .parse(process.argv)
