require("dotenv").config()

import { Crawler } from './planaria/crawler'

import { log } from './src/log'

export async function sync() {

  const block_height_start = 738000

  const crawler = new Crawler({

    query: {
      q: {
        find: { "out.s0": "boostpow", "blk.i": { "$gt": block_height_start } },
      }
    },

    onTransaction: (json) => {

      log.info('planaria.json', json)

    }
  })

  crawler.start()

}


sync()
