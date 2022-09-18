/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

import * as models from '../../src/models'

import { sendWebhooks } from '../../src/webhooks'

export async function start() {

  Actor.create({

    exchange: 'proofofwork',

    routingkey: 'work.published',

    queue: 'send_webhooks_for_work',

  })
  .start(async (channel, msg, json) => {

    log.info(msg.content.toString());

    log.info('send webhooks')

    let work = await models.BoostWork.findOne({
      where: {
        job_txid: json.job_txid
      }
    })

    await sendWebhooks(work)

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

