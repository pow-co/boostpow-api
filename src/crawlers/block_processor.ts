
import * as whatsonchain from '../whatsonchain'

import models from '../models'

export default async function start() {

  while(true) {

    const latestBlock = await models.Block.findOne({

      where: {
        //processed: true
      },

      order: [['height', 'desc']]

    })

    const height = !!latestBlock ? latestBlock.height : 625_000

    const nextBlock = await whatsonchain.getBlockByHeight({

      height: height + 1

    })

    if (nextBlock.hash) {

      const [record] = await models.Block.findOrCreate({
        where: {
          hash: nextBlock.hash
        },
        defaults: {
          hash: nextBlock.hash,
          size: nextBlock.size,
          txcount: nextBlock.txcount,
          height: nextBlock.height
        }
      })

      console.log(record.toJSON())

    }

  }

}

if (require.main === module) {

  start()

}

