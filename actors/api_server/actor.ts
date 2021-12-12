/* implements rabbi actor protocol */

require('dotenv').config();

import { startServer } from '../../src/server'

export async function start() {
 
  const { app } = await startServer()

  app.listen(process.env.PORT || 4001)

}

if (require.main === module) {

  start();

}


