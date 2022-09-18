
import { buildServer } from './server'

import { log } from './log'

import { start as slack } from './actors/slack_boost_job_created/actor'

export async function start() {

  const server = await buildServer();

  slack();

  await server.start();

  log.info(server.info)

}

if (require.main === module) {

  start()

}
