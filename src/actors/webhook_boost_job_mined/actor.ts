/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'proofofwork',

    routingkey: 'boost_job_mined',

    queue: 'webhook_boost_job_mined',

    schema: Joi.object() // optional, enforces validity of json schema

  })
  .start(async (channel, msg, json) => {

    log.info(msg.content.toString());

    log.info(json);

  });

}

if (require.main === module) {

  start();

}

