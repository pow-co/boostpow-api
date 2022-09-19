
import { buildServer } from './server'

import { log } from './log'

import { start as slack } from './actors/slack_boost_job_created/actor'

import { startCrawler } from './crawlers';

export async function start() {

  const server = await buildServer();

  slack();

  await server.start();

  startCrawler({ name: 'boostpow_jobs_original' })

  startCrawler({ name: 'boostpow_jobs_onchain' })

  startCrawler({ name: 'boostpow_proofs_onchain' })

  log.info(server.info)

}

if (require.main === module) {

  start()

}
