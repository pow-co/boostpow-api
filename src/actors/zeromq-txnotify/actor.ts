/* implements rabbi actor protocol */

require('dotenv').config();

import * as boost from 'boostpow';

import { Actor, Joi, log, getChannel } from 'rabbi';

import { importBoostJobFromTxid, importBoostProof } from '../../src/boost';

import * as bsv from 'bsv'

const zmq = require("zeromq")

function connectRawtxSocket() {

  let socket = new zmq.Subscriber;

  socket.connect(process.env.BITCOIND_ZEROMQ_URL);

  socket.subscribe('rawtx')

  return socket

}
function connectHashtxSocket() {

  let socket = new zmq.Subscriber;

  socket.connect(process.env.BITCOIND_ZEROMQ_URL);

  socket.subscribe('hashtx')

  return socket

}

export async function start() {

  const channel = await getChannel()

  let socket = connectHashtxSocket()
  let rawsocket = connectRawtxSocket()

  /*
  connectHashtxSocket().on("message", function(topic, msg) {

    log.info(msg.toString('hex'));

    channel.publish('proofofwork', 'zeromq_hashtx', Buffer.from(msg.toString('hex')))
     
  });
  */

  /*connectRawtxSocket().on("message", (topic, msg) => {

    log.info(msg.toString('hex'));

  })
  */
  channel.prefetch(1000)

  Actor.create({

    exchange: 'proofofwork',

    routingkey: 'zeromq_hashtx',

    queue: 'zeromq_log_hashtx',

    prefetch: 1000

  })
  .start(async (channel, msg, json) => {

    log.info(msg.content.toString());

  });

  (async () => {
    for await (const [topic, msg] of socket) {

      channel.publish('proofofwork', 'zeromq_hashtx', Buffer.from(msg.toString('hex')))
    }
      
  })();

  for await (const [topic, msg] of rawsocket) {
    let rawtx = msg.toString('hex')

    let tx = new bsv.Transaction(rawtx)

    await importBoostJobFromTxid(tx.hash)

    for (let input of tx.inputs) {
      let boostjob = boost.BoostPowJob.fromRawTransaction(rawtx)

      if (boostjob) {

        console.log('boost.job.found.publish', tx.hash)
        channel.publish('proofofwork', 'boost_job_found', Buffer.from(tx.hash))

      } else {

        let boostproof = boost.BoostPowJobProof.fromRawTransaction(rawtx)

        if (boostproof) {

          console.log('BOOST PROOF', boostproof)

          console.log('boost.proof.found.publish', tx.hash)
          channel.publish('proofofwork', 'boost_proof_found', Buffer.from(tx.hash))

          importBoostProof(tx.hash)

        }

      }

    }
  }

}

if (require.main === module) {

  start();

}

