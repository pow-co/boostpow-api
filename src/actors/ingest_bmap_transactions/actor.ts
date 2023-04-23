/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

import models from '../../models'

import { sendWebhooks } from '../../webhooks'

import { ingestBmapTransaction } from '../../bmap'

export async function start() {

  Actor.create({

    exchange: 'proofofwork',

    routingkey: 'bmap.transaction.rawtx',

    queue: 'ingest_bmap_transaction',

  })
  .start(async (channel, msg, json) => {

    const { bob, bmap } = json

    const [record, isNew] = await ingestBmapTransaction({ bob, bmap })

    if (isNew) {

      console.log('ingested new bmap transaction', record.toJSON())
    }

  });

}

if (require.main === module) {

  start();

}

