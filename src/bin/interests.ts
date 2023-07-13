
require('dotenv').config()

import { createCommand } from 'commander'

const program = createCommand()

import { ingestInterest, getRemoval, removeInterest } from '../personal_interests'

import models from '../models'

program
  .command('getspend <current_location>')
  .action(async (current_location: string) => {

    try {

      const spend = await getRemoval({ current_location })

      console.log(spend)

    } catch(error) {

      console.error(error)

    } 

    process.exit()

  })


program
  .command('remove <current_location>')
  .action(async (current_location: string) => {

    try {

      const result = await removeInterest({ current_location })

      console.log(result)

    } catch(error) {

      console.error(error)

    } 

    process.exit()

  })

program
  .command('ingest <current_location>')
  .action(async (current_location: string) => {

    try {

      const result = await ingestInterest({ current_location })

      console.log(result)

    } catch(error) {

      console.error(error)

    } 

    process.exit()

  })

program
  .command('correct-locations')
  .action(async () => {

    try {

      const interests = await models.PersonalInterest.findAll()

      for (let interest of interests) {

        const result = await ingestInterest({ current_location: interest.location })

        console.log(result)

      }

    } catch(error) {

      console.error(error)

    } 

    process.exit()

  })



program.parse(process.argv)

