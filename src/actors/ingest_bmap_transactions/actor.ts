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

    const [tx, isNew] = await ingestBmapTransaction({ bob, bmap })

    if (tx.bmap && tx.bmap && tx.bmap.MAP && tx.bmap.MAP[0].context === 'tx'  && tx.bmap.MAP[0].tx != 'null'){

      let originalPost = await models.Content.findOne({
        where: {
          txid: tx.bmap.MAP[0].tx
        }
      })

      if (originalPost) {

        let [content] = await cacheContent(tx.txid)
        
        if (!content.get('context_txid')) {

          await content.set('context_txid', tx.bmap.MAP[0].tx)

        }

        if (!content.get('bmap')) {

          await content.set('bmap', tx.bmap)

        }

      }
    }


  });

}

if (require.main === module) {

  start();

}

