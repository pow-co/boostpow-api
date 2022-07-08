#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

import * as models from '../../models'

program
  .command('addwebhook <url>')
  .action(async (url) => {

    try {

      let webhook = await models.Webhook.create({
        url
      })

      console.log(webhook.toJSON())

    } catch(error) {

      console.error(error)

    }

  })

program
  .parse(process.argv)
