/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

import models from '../../models'

import { sendWebhooks } from '../../webhooks'

import { ingestBmapTransaction } from '../../bmap'

import { cacheContent } from '../../content'

export async function start() {

  Actor.create({

    exchange: 'powco',

    routingkey: 'bmap.transaction.discovered',

    queue: 'ingest_bmap_transaction',

  })
  .start(async (channel, msg, json) => {

    const { bob, bmap } = json

    console.log({bob, bmap}, 'bmap.transaction.discovered')

    const [tx, isNew] = await ingestBmapTransaction({ bob, bmap })

    if (isNew) {

      console.log('ingested new bmap transaction', tx.toJSON())
    }

    if (tx.bmap && tx.bmap && tx.bmap.MAP && tx.bmap.MAP[0].context === 'tx'  && tx.bmap.MAP[0].tx != 'null'){

      console.log(tx.bmap.MAP)

      let originalPost = await models.Content.findOne({
        where: {
          txid: tx.bmap.MAP[0].tx
        }
      })

      if (originalPost) {

        console.log(originalPost.toJSON(), 'OP')

        console.log(tx)

        let [content] = await cacheContent(tx.txid)
        
        if (!content.get('context_txid')) {

          await content.set('context_txid', tx.bmap.MAP[0].tx)

          console.log(content.toJSON(), 'reply.imported')

        }

      }
    }


  });

}

if (require.main === module) {

  start();

}

