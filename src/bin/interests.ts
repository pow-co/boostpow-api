
require('dotenv').config()

import { createCommand } from 'commander'

const program = createCommand()

import { getRemoval, removeInterest } from '../personal_interests'

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



program.parse(process.argv)

