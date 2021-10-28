/* implements rabbi actor protocol */

require('dotenv').config();

import { app } from '../../src/server'

export async function start() {

  app.listen(process.env.PORT || 4001)

}

if (require.main === module) {

  start();

}


