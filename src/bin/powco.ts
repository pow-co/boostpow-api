#!/usr/bin/env ts-node
require('dotenv').config()

import { createCommand } from 'commander'

const program = createCommand()

import { cacheContent } from '../content'

program
  .command('import-content <txid')
  .action(async (txid) => {

    try {

      const [result] = await cacheContent(txid)

      console.log(result.toJSON())

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program.parse()

