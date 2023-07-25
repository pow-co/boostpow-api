
require('dotenv').config()

import models from '../models'

import { Op } from 'sequelize'

import { cacheContent } from '../content'

async function main(){

  console.log('about to find all')

  let txns = await models.BmapTransaction.findAll({
    order: [['createdAt', 'desc']],
    limit: 10000, 
    where: {
      bmap: {[Op.ne]: null}
    }
  })

  for (let tx of txns) {

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
  }
}

main()
