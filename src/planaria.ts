
import models from './models'

import { log } from './log'

import { Crawler, BitbusBlock, BitbusMessage } from '../planaria/crawler'

if (require.main === module) {

    start()

}

export async function start() {

    startCrawler({ name: 'planaria_boostpow_jobs' })    

}

interface StartCrawlerParams {
    name: string;
    query?: any;
    onTransaction?(json: BitbusMessage): Promise<any>
}

export async function startCrawler({name,query,onTransaction}: StartCrawlerParams): Promise<Crawler> {

    const crawlerModule = require(`./crawlers/${name}`)

    if (!query && !crawlerModule.query) {

        throw new Error(`query parameter must be provided`)
    }

    if (!onTransaction && !crawlerModule.onTransaction) {

        throw new Error(`onTransaction parameter must be provided`)
    }

    const [syncRecord] = await models.PlanariaSync.findOrCreate({

        where: { name },

        defaults: {

          name,

          query: crawlerModule.query

        }

    })
    
    log.info(`crawler.planaria.sync.record`, syncRecord.toJSON())
    
      const crawler = new Crawler({
    
        query: syncRecord.query,
    
        interval: syncRecord.interval,
    
        block_index_start: syncRecord.block_index,
    
        onTransaction: (json: BitbusMessage) => {
    
          //log.info('planaria.json', json)
    
        }
      })
    
      crawler.on('latestBlock', (blk: BitbusBlock) => {
    
        log.debug('latestBlock', blk)
    
        syncRecord.block_index = blk.i;
    
        syncRecord.save()
    
      })
    
      crawler.start()
    
      return crawler

}

