/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

const http = require("superagent");

import config from '../../config'

const SLACK_URL = process.env.SLACK_URL

export function notify(message: string) {

  log.info(`notify slack ${message}`);

  http
    .post(SLACK_URL)
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

  console.log("start actor")

  Actor.create({

    exchange: 'powco',

    routingkey: 'boostpow.job.created',

    queue: 'boostpow_job_created_notify_slack',

  })
  .start(async (channel, msg, json) => {

    log.info('boost.job.slack', msg.content.toString());

    if (SLACK_URL) {

      notify(`A New Boost Job Was Published\n\nhttps://whatsonchain.com/tx/${json.txid}`)

    }

  });

  Actor.create({

    exchange: 'powco',

    routingkey: 'boostpow.proof.created',

    queue: 'boostpow_proof_created_notify_slack',

  })
  .start(async (channel, msg, json) => {

    log.info('boostpow.proof.created.slack', msg.content.toString());

    if (SLACK_URL) {

      notify(`A New Boost Proof Was Mined\n\nhttps://whatsonchain.com/tx/${json.spend_txid}`)

    }

  });

}

if (require.main === module) {

  start();

}

