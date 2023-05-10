
require('dotenv').config()

import { buildServer } from './server'

import { log } from './log'

import { start as slack } from './actors/slack_boost_job_created/actor'

import { start as bmap } from './actors/ingest_bmap_transactions/actor'

import { startCrawler } from './crawlers';

import startSPV from './bsv_spv/main'

import config from './config';

import { schedule } from 'node-cron'

import { cacheTimeframe } from './rankings'

import { cacheMultiDayFeed } from './feeds/multi_day_feed'

export async function start(): Promise<void> {

  const server = await buildServer();

  if (config.get('notify_slack')) {

    slack();

  }

  if (process.env.AMQP_URL) {

    console.log('bmap.importer.start')

    bmap();

  }

  await server.start();

  if (config.get('bsv_spv_enabled')) {

    startSPV()

  }

  if (config.get('planaria_enabled')) {

    startCrawler({ name: 'boostpow_jobs_original' })

    startCrawler({ name: 'boostpow_jobs_onchain' })

    startCrawler({ name: 'boostpow_proofs_onchain' })

  }

  log.info('server.started', server.info)

  log.info('cache_refresh_cron_enabled', config.get('cache_refresh_cron_enabled'))

  schedule('* * * * *', async () => {

    try {

      //const result = await cacheAllTimeframes()
      const hour = await cacheTimeframe({ timeframe: 'last-hour' })
      console.log({ hour })
      await cacheTimeframe({ timeframe: 'last-day' })
      await cacheTimeframe({ timeframe: 'last-week' })
      await cacheTimeframe({ timeframe: 'last-month' })
      await cacheTimeframe({ timeframe: 'last-year' })
      await cacheTimeframe({ timeframe: 'all-time' })

      console.log('cache all timeframes complete')

      await cacheMultiDayFeed();

    } catch(error) {

       console.error('cache_refresh_cron_enabled', error)

    }


  })

  try {

    await cacheTimeframe({ timeframe: 'last-day' })
    await cacheTimeframe({ timeframe: 'last-week' })
    await cacheTimeframe({ timeframe: 'last-month' })
    await cacheTimeframe({ timeframe: 'last-year' })
    await cacheTimeframe({ timeframe: 'all-time' })

  } catch(error) {

       console.error('cache_refresh_cron_enabled', error)

  }

}

if (require.main === module) {

  start()

}
