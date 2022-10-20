
import { buildServer } from './server'

import { log } from './log'

import { start as slack } from './actors/slack_boost_job_created/actor'

import { startCrawler } from './crawlers';

import config from './config';

export async function start() {

  const server = await buildServer();

  if (config.get('notify_slack')) {

    slack();

  }

  await server.start();

  log.info(server.info)

  startCrawler({ name: 'boostpow_jobs_original' })

  startCrawler({ name: 'boostpow_jobs_onchain' })

  startCrawler({ name: 'boostpow_proofs_onchain' })

}

if (require.main === module) {

  start()

}
