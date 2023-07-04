
import { cacheContent } from '../../content'

import { flatten } from "lodash"

import models from '../../models'

import { badRequest } from 'boom'

import { log } from '../../log'
import { ingestBmapTransaction } from '../../bmap'

const { TransformTx, bobFromRawTx }  = require('bmapjs')

export async function show(req) {

    try {

        const [content] = await cacheContent(req.params.txid)

        let tags = await models.BoostWork.findAll({
          where: {
            content: req.params.txid
          },
          group: ['tag'],
          attributes: [
            'tag',
            [
              models.sequelize.fn('sum', models.sequelize.col('difficulty')),
              'difficulty'
            ]
          ]
        })

        tags = tags.map(tag => {

          return {
            hex: tag.tag,
            utf8: Buffer.from(tag.tag, 'hex').toString('utf8'),
            difficulty: tag.difficulty
          }

        })

        return { content: content.toJSON(), tags }
        
    } catch(error) {

        log.error('api.handlers.content.show.error', error)

        return badRequest(error.message)

    }

}

export async function create(request, hapi) {

  // parse content transaction
  // look up on by txid blockchain
  // if not on chain, broadcast then import

  try {

    const { transactions } = request.payload
    
    let records;

    Promise.all(transactions.map(async tx => {
      
      log.info('post.content.tx.import', tx)

      let bob = await bobFromRawTx(tx)
      let bmap = await TransformTx(bob)

      log.info('getBmapFromTxHex.result', { bob, bmap })

      let record = await ingestBmapTransaction({ bob, bmap })
      
      log.info("content.tx.import.response", record)
      
      records.push(record)

    }))

    let json = flatten(records).map(r => r.toJSON())

    return hapi.response({ posts: json }).code(200)
    
  } catch (error) {

    log.error('posts.tx.import.error', error)

    return { posts: []}
    
  }

}
