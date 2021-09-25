#!/usr/bin/env ts-node

require('dotenv').config()

var bitcoin = require('bitcoinjs-lib') // v4.x.x
var bitcoinMessage = require('bitcoinjs-message')

import * as program from 'commander'

import pg from '../database'

import * as boost from 'boostpow-js';
//import * as boost from 'boostpow';

import * as bsv from 'bsv'

import { Miner } from '../miner'

import { getTransaction } from '../jsonrpc'

import * as Minercraft from 'minercraft'

const SimpleWallet = require('../../../../stevenzeiler/bsv-simple-wallet/lib')

let miner = new Miner()

import { connectChannel } from '../socket'

program
  .command('solve <rawtx>')
  .action(async (rawtx) => {

    let job = boost.BoostPowJob.fromRawTransaction(rawtx)

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
  .command('newjob <content> <tag> <category> <difficulty> <satoshis>')
  .action(async (content, tag, category, diff, satoshis) => {
    diff = parseFloat(diff)

    let job = boost.BoostPowJob.fromObject({
      content,
      tag,
      category,
      diff
    })

    console.log('JOB', job)

    console.log('ASM', job.toASM())
    console.log('HEX', job.toHex())

    let tx = new bsv.Transaction()

    const wallet = new SimpleWallet(new bsv.PrivateKey(process.env.BSV_SIMPLE_WALLET_WIF));

    await wallet.sync();

    let inputs = await SimpleWallet.getUtxos(satoshis, wallet.utxos)

    tx.from(inputs)

    tx.addOutput(new bsv.Transaction.Output({
      script: bsv.Script(new bsv.Script(job.toHex())),
      satoshis: satoshis
    }))

    tx.change(wallet.getAddress())

    tx.sign(wallet.getPrivateKey())

    let hex = tx.serialize(true)

    const miner = new Minercraft({
      "url": "https://merchantapi.taal.com"
    })

    console.log('tx', hex)

    try {

      let response = await miner.tx.push(hex)

      console.log(response)
      console.log('boost job published')

    } catch(error) {

      console.error(error)

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

    let tx = await getTransaction(txid)

    let job = boost.BoostPowJob.fromRawTransaction(tx.hex)

    console.log(job.toObject())

    console.log('content', job.toObject().content.toString())
  })

program
  .command('importboosttxns')
  .action(async (txid) => {

    let records = await pg('planaria_records').select('*')

    for (let record of records) {

      if (record.tx) {

        //console.log(record)


        try {

          let j = boost.BoostPowJob.fromRawTransaction(record.tx.hex)

          let job = j.toObject()

          let params = Object.assign(job, {
            difficulty: job.diff,
            content: job.content,
            category: job.category,
            tag: job.tag,
            additionalData: job.additionalData,
            userNonce: job.userNonce,
            inserted_at: new Date(),
            updated_at: new Date(),
            //txid: job.txid,
            //vout: job.vout,
            //value: job.value,
            //timestamp: record.time
          })

          //delete params['diff']

          if (params.diff < 1) {

            //console.log('job', params)

            //let job_record = await pg('boost_jobs').insert(params).returning('*')

            //console.log(job_record)

          }

        } catch(error) {

          console.error(error.message)

        }
      }

    }
  
  })

program
  .parse(process.argv)
