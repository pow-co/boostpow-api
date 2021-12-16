/* implements rabbi actor protocol */

require('dotenv').config();

import { log } from '../../src/log'

import { startServer } from '../../src/server'

export async function start() {
 
  const { app } = await startServer()

  const port = process.env.PORT || 4001

  app.listen(port)

  log.info('apiserver.listen', { port })

}

if (require.main === module) {

  start();

}


