
require('dotenv').config()

import { buildServer } from './server'

import { log } from './log'

import { start as slack } from './actors/slack_boost_job_created/actor'

import { startCrawler } from './crawlers';

import startSPV from './bsv_spv/main'

import config from './config';

import { schedule } from 'node-cron'

import { cacheAllTimeframes } from './rankings'

export async function start(): Promise<void> {

  const server = await buildServer();

  if (config.get('notify_slack')) {

    slack();

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

  if (process.env.cache_refresh_cron_enabled) {

    schedule(process.env.cache_refresh_cron_pattern, cacheAllTimeframes)

  }

}

if (require.main === module) {

  start()

}
