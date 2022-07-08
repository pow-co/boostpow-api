
import { start as api_server } from './server'


import { startActorsDirectory } from 'rabbi'

import { start as booster } from '../actors/booster/actor'

import { log } from './log'

import config from './config'

export default async function start() {

  if (config.get('booster_enabled') && config.get('booster_private_key')) {

    log.debug('booster.enabled')

    require('../actors/booster/actor').start()

  }

  if (config.get('telegram_notifications_enabled')) {

    log.debug('telegram.notifications.enabled')

    require('../actors/notify_telegram_boost_job_created/actor').start()

    require('../actors/notify_telegram_boost_job_mined/actor').start()

  }

  if (config.get('twetch_publisher_enabled')) {

    log.debug('twetch.publisher.enabled')

    require('../actors/twetch_on_boost_job_created/actor').start()

  }

  if (config.get('webhooks_enabled')) {

    log.debug('webhooks.enabled')

    require('../actors/webhook_boost_job_created/actor').start()

    require('../actors/webhook_boost_job_mined/actor').start()

    require('../actors/send_webhooks_on_mined/actor').start()

  }

  if (config.get('planaria_sync_enabled')) {

    log.debug('planaria.sync.enabled')

    const planaria = require('../planaria/index.ts')

    //require('../actors/planaria_sync/actor').start()

  }

  if (config.get('zeromq_sync_enabled')) {

    log.debug('zeromq.sync.enabled')

    require('../actors/zeromq-txnotify/actor').start()

  }

  if (config.get('http_api_enabled')) {

    api_server()

  }

}

if (require.main === module) {

  start()

}

