/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import config from '../../src/config'

import * as cron from 'node-cron';

import { postNewJob } from '../../src/boost'

export async function start() {

  let result = await postNewJob({
   content: config.get('booster_content'),
   difficulty: config.get('booster_difficulty'),
   satoshis: config.get('booster_value')
  })

  cron.schedule(config.get('booster_interval'), async () => { // every ten minute

    let result = await postNewJob({
     content: config.get('booster_content'),
     difficulty: config.get('booster_difficulty'),
     satoshis: config.get('booster_value')
    })

  })

}

if (require.main === module) {

  start();

}

