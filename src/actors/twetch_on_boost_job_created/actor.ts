/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

const Twetch = require('@twetch/sdk');
const twetch = new Twetch({
  clientIdentifier: process.env.TWETCH_CLIENT_IDENTIFIER
});

export async function start() {

  twetch.wallet.restore(process.env.TWETCH_PRIVATE_KEY)

  await twetch.authenticate()

  Actor.create({

    exchange: 'proofofwork',

    routingkey: 'boost_job_created',

    queue: 'twetch_on_boost_job_created',

    schema: Joi.object({
      txid: Joi.string().required()
    })

  })
  .start(async (channel, msg, json) => {

    log.info(msg.content.toString());

    log.info(json);

    let post = await twetch.publish('twetch/post@0.0.1', {

      bContent: `A New Boost Job Was Published\n\nhttps://whatsonchain.com/tx/${json.txid}`
    })

  });

}

if (require.main === module) {

  start();

}

