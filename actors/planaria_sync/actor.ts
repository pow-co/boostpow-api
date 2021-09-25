/* implements rabbi actor protocol */

require('dotenv').config();

import { sync } from '../../planaria'

import { delay, log } from 'rabbi'

export async function start() {

  while (true) {

    try {

      log.info('planaria.boost.sync') 

      await sync()

    } catch(error) {

      log.error(error.message)

    }

    await delay(1000 * 60)

  }

}

if (require.main === module) {

  start();

}

