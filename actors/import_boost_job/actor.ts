/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { importBoostJobFromTxid, importBoostProof } from '../../src/boost'

export async function start() {

  Actor.create({

    exchange: 'proofofwork',

    routingkey: 'boost_job_found',

    queue: 'import_boost_job',

  })
  .start(async (channel, msg) => {

    try {

      const txid = msg.content.toString()

      log.info('boost.job.found', txid);

      let result = await importBoostJobFromTxid(txid)

      channel.publish('proofofwork', 'boost_job_created', Buffer.from(JSON.stringify(result)))

      console.log('boost.job.imported', JSON.stringify(result))

      channel.ack(msg);

    } catch(error) {

      console.error(error.message)

    }

  });

  Actor.create({

    exchange: 'proofofwork',

    routingkey: 'boost_proof_found',

    queue: 'import_boost_proof',

  })
  .start(async (channel, msg) => {

    try {

      const txid = msg.content.toString()

      log.info('boost.proof.found', txid);

      /*let result = await importBoostProof(txid)

      channel.publish('proofofwork', 'boost_proof_created', Buffer.from(JSON.stringify(result)))

      console.log('boost.proof.imported', JSON.stringify(result))
      */

      channel.ack(msg);

    } catch(error) {

      console.error(error.message)

    }

  });

}

if (require.main === module) {

  start();

}

