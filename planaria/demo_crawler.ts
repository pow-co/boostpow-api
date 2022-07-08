
import { Crawler } from './crawler'

const crawler = new Crawler({

  query: {
    q: {
      //find: { "out.s2": "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut", "blk.i": { "$gt": 609000 } }
      find: { "out.s0": "boostpow", "blk.i": { "$gt": 609000 } }
    }
  },

  onTransaction: async (json) => {

    console.log(json)

  }
})

crawler.start()

