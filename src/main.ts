
import { buildServer } from './server'

import { log } from './log'

import { start as slack } from './actors/slack_boost_job_created/actor'

import { startCrawler } from './crawlers';

import startSPV from './bsv_spv/main'

import config from './config';

export async function start() {

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

}

if (require.main === module) {

  start()

}
