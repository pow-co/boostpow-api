/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

import * as models from '../../models'

import { sendWebhooks } from '../../webhooks'

import { ingestBmapTransaction } from '../../bmap'

export async function start() {

  Actor.create({

    exchange: 'powco',

    routingkey: 'bmap.transaction.discovered',

    queue: 'ingest_bmap_transaction',

  })
  .start(async (channel, msg, json) => {

    const { bob, bmap } = json

    console.log({bob, bmap}, 'bmap.transaction.discovered')

    const [record, isNew] = await ingestBmapTransaction({ bob, bmap })

    if (isNew) {

      console.log('ingested new bmap transaction', record.toJSON())
    }

  });

}

if (require.main === module) {

  start();

}

