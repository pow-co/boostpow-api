/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

const http = require("superagent");

export function notify(message: string) {

  log.info(`notify slack ${message}`);

  http
    .post('https://hooks.slack.com/services/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')
    .send({
      text: message
    })
    .end((error, response) => {
      if (error) {
        log.error("slack:error", error.message);
      } else {
        log.info("slack:notified", response.body);
      }
    });
}


export async function start() {

  Actor.create({

    exchange: 'proofofwork',

    routingkey: 'boost_job_created',

    queue: 'slack_boost_job_created',

    schema: Joi.object() // optional, enforces validity of json schema

  })
  .start(async (channel, msg, json) => {

    log.info('boost.job.slack', msg.content.toString());

    log.info('boost.job.slack.json', json);

    notify(`A New Boost Job Was Published\n\nhttps://whatsonchain.com/tx/${json.txid}`)

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

