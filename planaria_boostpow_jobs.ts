require("dotenv").config()

import * as models from './src/models'

import { log } from './src/log'

import { Crawler, BitbusBlock } from './planaria/crawler'

export default async function start() {

  const name = 'boostpow.jobs.out.s0'

  const [syncRecord] = await models.PlanariaSync.findOrCreate({
    where: { name },
    defaults: {
      name,
      query: {
        "out.s0": "boostpow"
      }
    }
  })

  log.info('planaria.sync.record', syncRecord.toJSON())

  const crawler = new Crawler({

    query: syncRecord.query,

    interval: syncRecord.interval,

    block_index_start: syncRecord.block_index,

    onTransaction: (json) => {

      //log.info('planaria.json', json)

    }
  })

  crawler.on('latestBlock', (blk: BitbusBlock) => {

    log.debug('latestBlock', blk)

    syncRecord.block_index = blk.i;

    syncRecord.save()

  })

  crawler.start()

}

if (require.main === module) {

  start()

}
