#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'
import { call } from '../jsonrpc'

import * as models from '../../models'

const db = require('../../models')

const redis = require('async-redis')

const cache = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

const delay = require('delay')

interface BlockchainProcessorOptions {
  indexName?: string;
  blockDelay?: 2000;
}

class BlockchainProcessor {
  currentHeight: number;
  indexName: string;
  blockDelay: number;

  constructor(currentHeight: number = 0, options) {
    this.currentHeight = currentHeight;
    this.indexName = options.indexName || 'blockheight'
    this.blockDelay = options.blockDelay || 2000
  }
  async incrementHeight() {

    let height = this.currentHeight
    await cache.set(this.indexName, height + 1)
    this.currentHeight = height + 1
  }

  async processBlocks(processFunction='indexBlock') {

    console.log('process blocks', processFunction)

    while (true) {

      let height = this.currentHeight

      try {

        //await this[processFunction]()

        await this.processInputs()

        await this.incrementHeight()

      } catch(error) {

        await delay(this.blockDelay)

      }

    }
  }

  async processWork() {

    await this.processBlocks(this.processBlock.bind(this.findWork))

  }

  async processInputs() {

    await this.processBlocks(this.processBlock.bind(this.indexTxInputs))

  }

  async processBlock(f) {

    let height = this.currentHeight

    console.log(this.indexName, { height })

    let {result: hash}= await call('getblockhash', [height])

    let {result: block} = await call('getblock', [hash])

    for (let txid of block['tx']) {

      let {result: tx} = await call('getrawtransaction', [txid, true])

      await f(tx, {height, hash, txid})

    }

  }

  async findWork(tx, {height, hash}) {

    console.log(tx)

    var input;

    let job = await models.BoostJob.findOne({
      where: {
        txid: input.txid,
        vout: input.vout
      }
    })

    if (job) {

      console.log('JOB FOUND', tx)

      let work = await models.BoostWork.findOne({
        where: {
          job_txid: input.txid,
          job_vou: input.vout
        }
      })

      if (work) {

        console.log('WORK FOUND', tx)

      } else {

        // create work here

      }

    }

  }

  async indexTxInputs(tx, {height, hash, txid}) {

    let [transaction] = await db.Transaction.findOrCreate({
      where: { txid },
      defaults: { txid, time: tx.time, blockhash: tx.blockhash }
    })

    console.log(transaction.toJSON())

    for (let vin of tx['vin']) {

      try {

        let [transaction_input] = await db.TransactionInput.findOrCreate({
          where: { txid, input_txid: vin['txid'], input_index: vin['vout'] },
          defaults: {
            txid,
            input_txid: vin['txid'],
            input_index: vin['vout'],
            block_height: height,
            block_hash: hash
          }
        })

        console.log(transaction_input.toJSON())

      } catch(error) {

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
  .action(async (indexname='indexBlock') => {

    try {

      let height = await cache.get('blockheight')

      console.log('cache', height)

      let processor = new BlockchainProcessor(parseInt(height), 'indexBlock')

      processor.processBlocks()

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('processblocks [indexname]')
  .action(async (indexname='blockheight') => {

    try {

      let height = await cache.get(indexname)

      console.log('cache', height)

      let processor = new BlockchainProcessor(parseInt(height), indexname)

      processor.processBlocks()

    } catch(error) {

      console.error(error)

    }

  })

program
  .parse(process.argv)
