#!/usr/bin/env ts-node

require('dotenv').config()

var bitcoin = require('bitcoinjs-lib') // v4.x.x
var bitcoinMessage = require('bitcoinjs-message')

import { Op } from 'sequelize'

import * as http from 'superagent'

import * as boostpow from 'boostpow'

const delay = require('delay');

import * as program from 'commander'

import pg from '../database'

import * as models from '../models'

import * as boost from 'boostpow';

import * as bsv from 'bsv'

import * as whatsonchain from '../whatsonchain'
import * as powco from '../powco'

import { getTransaction, getTransactionJson, call } from '../jsonrpc'

import { getAveragePrice } from '../prices'

import * as Minercraft from 'minercraft'

import { cacheContent } from '../content'

const mapi = new Minercraft({
  "url": "https://merchantapi.taal.com"
})

import { postNewJob } from '../boost'

import { getBoostJobsFromTxid, getBoostProof, getBoostJob, checkBoostSpent, BoostJob, importBoostJob, importBoostProof } from '../boost'

const SimpleWallet = require('../../../../stevenzeiler/bsv-simple-wallet/lib')

import { connectChannel } from '../socket'

program
  .command('cacheallcontent')
  .action(async () => {

    try {

      let {rows: allcontent} = await pg.raw('select content from "boost_jobs" where content is not null group by content')

      for (let item of allcontent) {

        console.log('ITEM', item)

        let record = await cacheContent(item.content)

        console.log(record.toJSON())
  
      }

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program
  .command('cachecontent <content>')
  .action(async (content) => {

    try {

      let {rows: allcontent} = await pg.raw(`select content from "boost_jobs" where content = '${content}' group by content`)

      for (let item of allcontent) {

        let record = await cacheContent(item.content)

        console.log(record.toJSON())
  
      }

      if (allcontent.length == 0) {

        let record = await cacheContent(content)

        console.log(record.toJSON())
          
      }

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program
  .command('getaverageprice [startTimestamp]')
  .action(async (startTimestamp) => {

    try {

      let price = await getAveragePrice(startTimestamp)

      console.log(price)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program
  .command('importproof <txid>')
  .action(async (txid) => {

    try {

      let proof = await getBoostProof(txid)

      console.log('proof', proof.toObject())

      let record = await importBoostProof(proof)

      if (record) {

        console.log('proof record', record)
      }

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program
  .command('sign <message>')
  .action(async (message) => {

    var keyPair = bitcoin.ECPair.fromWIF('L4rK1yDtCWekvXuE6oXD9jCYfFNV2cWRpVuPLBcCU2z8TrisoyY1')
    var privateKey = keyPair.privateKey
    var message: any = 'This is an example of a signed message.'

    var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
    console.log(signature.toString('base64'))

  })

program
  .command('newjobscript <content> <difficulty> <satoshis>')
  .action(async (content, diff, satoshis) => {


    satoshis = parseInt(satoshis)

    diff = parseFloat(diff)

    try {

      let obj = {
        content,
        diff
      }

      console.log('obj', obj)

      let job = boost.BoostPowJob.fromObject(obj)

      console.log('JOB', job)

      console.log('ASM', job.toASM())
      console.log('HEX', job.toHex())
      console.log('TO SCRIPT', job.toScript())

      //console.log('FROM SCRIPT', boost.BoostPowJob.fromScript(job.toHex()))

    } catch(error) {
      console.error(error)
    }
  })

program
  .command('newjob <content> <difficulty> <satoshis>')
  .action(async (content, difficulty, satoshis) => {

    satoshis = parseInt(satoshis)

    difficulty = parseFloat(difficulty)

    await postNewJob({ content, satoshis, difficulty })

  })

program
  .command('parsejob <rawtx> [vout]')
  .action(async (rawtx, vout=0) => {

    let tx = new bsv.Transaction(rawtx)

    console.log(tx)

    let job = boost.BoostPowJob.fromRawTransaction(rawtx)
    
    console.log('JOB', job)

    console.log('ASM', job.toASM())
    console.log('HEX', job.toHex())

  })

program
  .command('submitproofbytxid <txid>')
  .action(async (txid) => {

    try {

      let { hex } = await getTransaction(txid)
      
      console.log(hex)

      let resp = await http.post('https://pow.co/node/api/boost_proof_transactions')
      .send({ transaction: hex })

      console.log(resp)


    } catch(error) {

      console.error(error)

    }

  })



program
  .command('getrawtx <txid>')
  .action(async (txid) => {

    try {

      let tx = await getTransaction(txid)
      
      console.log(tx)

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('mine <txid> <payment_address>')
  .action(async (txid, address) => {

    /*
     * This is the ultimate command that takes a given transaction and mines the bitcoins contained in
     * any boost puzzle from that transaction
     *
     * 1) downloads raw transaction from blockchain index
     * 2) parses all boost jobs from the transaction outputs
     * 3) using boost cpu miner computes solution to the boost puzzle
     * 4) constructs transaction paying boost solution to specified address
     * 5) broadcasts the transaction to bitcoin miners
     */

  })

async function parseBoostTx(txid) {

  let tx = await getTransaction(txid)

  let job = boost.BoostPowJob.fromRawTransaction(tx.hex)

  return job

}

program
  .command('parseboosttx <txid>')
  .action(async (txid) => {

    let job = await getBoostJob(txid)

    console.log(job)

  })

program
  .command('checkboostspends')
  .action(async () => {

    console.log('import')

    let records = await pg('boost_jobs').where({
      spent: false
    }).select('*')

    for (let job of records) {
      console.log(job)

      let {result}: any = await checkBoostSpent(job.txid, job.vout)

      if (!result) {
        await pg('boost_jobs').where({
          txid: job.txid
        })
        .update({ spent: true })
      }

      console.log(result)
    }

    process.exit(0)

  })

program
  .command('importboostjob <txid>')
  .action(async (txid) => {

    try {

      let newRecord = await importBoostJob(txid)

      console.log(newRecord)

    } catch(error) {

      console.error(error)

      process.exit(1)
    }
  })

program
  .command('importboosttxns')
  .action(async (txid) => {

    let records = await pg('planaria_records').select('*')

    for (let record of records) {

      console.log('record', record)

      try {

        let job = await importBoostJob(record.txid)

        console.log(job)

      } catch(error) {

        console.log(error)

      }

    }
  
  })

program
  .command('fillworktags')
  .action(async () => {

    try {

      let jobs = await models.BoostJob.findAll({

        where: {

          tag: {

            [Op.ne]: null

          }

        }

      })

      for (let job of jobs) {

        let work = await models.BoostWork

      }

      let works = await models.BoostWork.findAll()

      for (let work of works) {

        console.log({ work: work.toJSON() })

        if (!work.tag) {

          let job = await models.BoostJob.findOne({

            where: {
              spent_txid: work.spend_txid,
              spent_vout: work.spend_vout
            }

          })

          if (job && job.tag) {

            console.log({ job: job.toJSON() })

            work.tag = job.tag
            await work.save()

          }

        }

      }

    } catch(error) {

      console.error(error)

    }

    process.exit(0)


  })



program
  .command('backfillallwork')
  .action(async (txid) => {

    let works = await pg('boost_job_proofs').select('*').whereNull('timestamp').returning('*')

    for (let work of works) {

      console.log(await backfillWork(work.spend_txid))

    }

    process.exit(0)


  })

program
  .command('backfillproofvalues')
  .action(async () => {

    let works = await models.BoostWork.findAll({
      where: {
        value: {
          [Op.eq]: null
        }
      }
    })

    for (let work of works) {

      let job = await models.BoostJob.findOne({
        where: { txid: work.job_txid }
      })

      work.value = job.value;

      await work.save()

      console.log(work.toJSON())

    }

    process.exit(0)


  })



async function backfillWork(txid) {

  let [work] = await pg('boost_job_proofs').select('*').where({ spend_txid: txid })

  console.log(work)

  let [job] = await pg('boost_jobs').select('*').where({ txid: work.job_txid, vout: work.job_vout })

  console.log(job)

  let tx = await getTransactionJson(txid)

  console.log(tx)


  let timestamp = new Date(tx.time * 1000)
  let content = job.content
  let difficulty = job.difficulty
  let signature = tx.vin[work.spend_vout].scriptSig.hex

  let update = await pg('boost_job_proofs').update({
    timestamp, content, difficulty
  })
  .where({ id: work.id })

  work = await pg('boost_job_proofs').select('*').where({ spend_txid: txid })

  return work[0]

}

program
  .command('getboostjob <txid>')
  .action(async (txid) => {

    let jobs = await getBoostJobsFromTxid(txid)

    console.log(jobs)

  })

program
  .command('backfilltimestamps')
  .action(async () => {

    try {

      let jobs = await models.BoostJob.findAll({
        where: {
          timestamp: { [Op.eq]: null }
        }
      })

      for (let job of jobs) {

        let tx = await whatsonchain.getTransaction(job.txid)

        let date = new Date(tx.time * 1000)

        job.timestamp = date

        await job.save()

        console.log(job.toJSON())

      }

      let works = await models.BoostWork.findAll({
        where: {
          timestamp: { [Op.eq]: null }
        }
      })

      for (let work of works) {

        try {

          let tx = await whatsonchain.getTransaction(work.spend_txid)

          let date = new Date(tx.time * 1000)

          work.timestamp = date

          await work.save()

          console.log(work.toJSON())

        } catch(error) {

          console.error(error)

        }
      } 

    } catch(error) {

      console.error(error)

    }


  })

program
  .command('backfilltimestamp <txid>')
  .action(async (txid) => {

    try {

      let job = await models.BoostJob.findOne({
        where: {
          timestamp: { [Op.eq]: null },
          txid
        }
      })

      let tx = await whatsonchain.getTransaction(job.txid)

      console.log('TX', tx)
      let date = new Date(tx.time * 1000)
      console.log(date)

      console.log(job.toJSON(), tx)

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('backfillwork')
  .action(async () => {

    try {

      let works = await models.BoostWork.findAll({
        where: {
          content: { [Op.eq]: null }
        }
      })

      for (let work of works) {
        console.log(work.toJSON())

        let job = await models.BoostJob.findOne({
          where: {
            txid: work.job_txid,
            vout: work.job_vout
          }

        })

        work.content = job.content
        work.difficulty = job.difficulty

        await work.save()

        console.log(work.toJSON())

      }

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('findworkforjob <txid>')
  .action(async (txid) => {

    try {

      let work = await findWorkForJob(txid)

      console.log(work)

    } catch(error) {

      console.error(error)

    }

  })

export async function findWorkForJob(txid: string): Promise<any> {

  let tx = await powco.getTransaction(txid)

  let job = boostpow.BoostPowJob.fromTransaction(tx)

  let script = tx.outputs[job.vout];

  console.log(job)
  console.log(script)

  let scripthash = bsv.crypto.Hash.sha256(script.toBuffer()).reverse().toString('hex')

  // get transaction from txid
  // load job from transaction
  // look up spend transactions for job script
  // find which transaction spent the script output

}

program
  .command('checktxforwork <txid>')
  .action(async (txid) => {

    let tx = await powco.getTransaction(txid)

    console.log(tx)

    for (let input of tx.inputs) {


      var where: any = {
        txid: input.prevTxId.toString('hex'),
        vout: input.outputIndex
      }

      console.log('params', where)

      let job = await models.BoostJob.findOne({ where })

      if (job) {

        console.log('WORK FOUND', tx)

      }

      where = {
        spend_txid: input.prevTxId.toString('hex'),
        spend_vout: input.outputIndex
      }

      console.log('work where', where)

      let work = await models.BoostWork.findOne({
        where: {
          job_txid: job.txid,
          job_vout: job.vout
        }
      })

      if (work) {

        console.log('WORK ALREADY RECORDED', work.toJSON())

        continue;
      } else {

        

      }

    }

  })

program
  .command('reimportboosttxns')
  .action(async (txid) => {

    let records = await pg('boost_jobs').where({
      script: null,
    }).whereNotNull('txid').select('*')

    for (let record of records) {

      try {

        console.log('record', record)

        let job = await importBoostJob(record.txid)

        console.log('job', job)

      } catch(error) {

        console.log(error)

      }

    }
  })

program
  .parse(process.argv)
