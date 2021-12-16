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

import * as models from '../../models'

import * as boost from 'boostpow';

import * as bsv from 'bsv'

import * as whatsonchain from '../whatsonchain'
import * as powco from '../powco'

import { getTransaction, getTransactionJson, call } from '../jsonrpc'

import * as Minercraft from 'minercraft'

const mapi = new Minercraft({
  "url": "https://merchantapi.taal.com"
})

import { postNewJob } from '../boost'

import { getBoostJobsFromTxid, getBoostProof, getBoostJob, checkBoostSpent, BoostJob, importBoostJob, importBoostProof } from '../boost'

const SimpleWallet = require('../../../../stevenzeiler/bsv-simple-wallet/lib')

import { connectChannel } from '../socket'

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
  .command('minerd <address> [wif]')
  .action(async (address, wif) => {

    wif = wif || process.env.MINER_SECRET_KEY_WIF


    for (;;) {

      try {

        let [job] = await pg('boost_jobs').where({
          spent: false,
          //difficulty: 1
        }).orderBy('difficulty', 'asc').orderBy('value', 'desc').select('*').limit(1)

        if (!job) {
          await delay(1000)
        }

        console.log('miner.job', job)

        await importBoostJob(job.txid)

        let _job = await getBoostJob(job.txid)

        console.log('_job', _job)

        if (_job.spent) {

          await pg('boost_jobs').where({
            txid: job.txid
          })
          .update({ spent: true })
          
          continue;
        }

        let result = await mine(job.txid, address, wif, _job)

        console.log('mining result', result)

      } catch(error) {

        console.log(error)

        await delay(1000)

      }

    }

  })

async function mine(txid, address, wif, job) {

  if (!job) {

    job = await getBoostJob(txid)

  }

  console.log('job', job)

  if (job.spent) {
    throw new Error('job already mined')
  }

  miner.on('*', event => {
    console.log(event)
  })

  let solution: any = await miner.mine({
    script: job.script,
    value: job.value,
    vout: job.vout,
    txid,
    address,
    wif
  })

  console.log(solution)

  let result = await mapi.tx.push(solution.txhex, { verbose: true })

  console.log('transaction.publish.result', result)

  if (result.payload.returnResult === 'success') {

    let txid = result.payload.txid

    await pg('boost_jobs').where({
      txid: job.txid
    })
    .update({ spent: true, spend_txid: txid })

  }

}

program
  .command('mine <txid> <address> [wif]')
  .action(async (txid, address, wif) => {

    wif = wif || process.env.MINER_SECRET_KEY_WIF

    await mine(txid,address,wif, null)

    process.exit(0)

  })

/*program
  .command('solve <rawtx>')
  .action(async (rawtx) => {

    let job = boost.BoostPowJob.fromRawTransaction(rawtx)

    console.log('job', job.toObject())

    const channel = await connectChannel()

    miner.mine({
      content: `0x${job.toObject().content}`,
      difficulty: job.toObject().diff
    })

    miner.on('besthash', (payload) => {
      //console.log('besthash', payload)
      channel.push('besthash', payload)
    })

    miner.on('error', (payload) => {
      console.error(payload)
      process.exit(1)
    })

    miner.on('solution', (payload) => {
      console.log('solution', payload)
      channel.push('solution', payload)

      miner.stop()

      console.log('stopping miner..')

      let script = redeem(payload.solution.replace('"', ''))

      console.log('SCRIPT', script)

      setTimeout(process.exit, 1000)
    })

    miner.on('hashrate', (payload) => {
      //console.log(payload)
      channel.push('hashrate', payload)
    })

  })

*/
function redeem(solutionDummySignature: string): bsv.Script {

  let script = new bsv.Script(solutionDummySignature) 

  let asm = script.toASM()

  let parts = asm.split(" ")

  parts.shift()

  console.log('parts', parts)

  let newScript = new bsv.Script.fromASM(parts.join(" "))

  console.log('newscript', newScript.toHex())

  let secret = process.env.MINER_SECRET_KEY_WIF

  console.log('secret', secret)

  var keyPair = bitcoin.ECPair.fromWIF(secret)

  console.log("privkey", keyPair)

  console.log('hex', newScript.toHex())

  var signature = bitcoinMessage.sign(newScript.toHex(), keyPair.privateKey, keyPair.compressed)

  let base64 = signature.toString('base64')

  console.log('base64', base64)

  let hex = new Buffer(base64, 'base64').toString('hex')

  console.log('signature', hex)

  parts.unshift(hex)

  let finalScript = bsv.Script.fromASM(parts.join(' '))

  return finalScript

}

program
  .command('redeem <txid> <vout> <script>')
  .action(async (txid, vout, script) => {

    try {

      let tx = new bsv.Transaction()


    } catch(error) {

      console.error(error)

    }

  })

program
  //.command('validateproof <script> <txid> <vout>')
  .command('validateproof')
  .action(async (_script) => {

    let script = bsv.Script.fromHex("3045022100F4F9BAFC52C5AF26DF573FD4EC6BE70A428E6FDB8006AACD7FD66A2BB39A95330220685D0FF0728DD9280FDE0D215ABADFEE1774CDCD4197C2D491CB7665CE230BDC41 033BF18508719DC8BCB425138A72809D89F82A4B64473688104310A3CB03A5AE94 96570000 87274D61 9BA13AE2CBEA9A2F 681B3C8C 55E2CD15FB1F68CD3A746DBA045D15B3DB329B0F")

    console.log(script.chunks.length, script)

    let proof = boost.BoostPowJobProof.fromScript(script)

    try {

      let tx = new bsv.Transaction()


    } catch(error) {

      console.error(error)

    }

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

      console.log('FROM SCRIPT', boost.BoostPowJob.fromScript(job.toHex()))

    } catch(error) {
      console.error(error)
    }
  })

program
  .command('newjob <content> <difficulty> <satoshis>')
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

      console.log('FROM SCRIPT', boost.BoostPowJob.fromScript(job.toHex()))

      var config = {
        pay: {
          key: process.env.BSV_SIMPLE_WALLET_WIF,
          rpc: "",
          to: [{
            script: job.toHex(),
            value: satoshis
          }],
          changeAddress: process.env.BSV_SIMPLE_WALLET_ADDRESS
        }
      }

      console.log(config)

      filepay.send(config, async (err, result) => {
        if (err) { throw err }
        let [txid] = result.split(' ')
        console.log('job.created', { txid })

        await delay(5000)
        let newRecord = await importBoostJob(txid)
        console.log('job.imported', newRecord)
      })

    } catch(error) {
      console.log(error)

    }

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
  .command('backfillwork <txid>')
  .action(async (txid) => {

    let [work] = await pg('boost_job_proofs').select('*').where({ spend_txid: txid })

    console.log(work)

    // get job proof
    // get job
    // get tx json
    // add content, difficulty, timestamp

    let jobs = await getBoostJobsFromTxid(txid)

    console.log(jobs)

  })



program
  .command('getboostjob <txid>')
  .action(async (txid) => {

    let jobs = await getBoostJobsFromTxid(txid)

    console.log(jobs)

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
