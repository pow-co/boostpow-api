
import models from './src/models'

import { fetch } from 'powco'

export default async function main() {

  let records = await models.BoostJob.findAll()

  for (let record of records) {

    if (record.tx_hex && record.script) {

      continue

    } 

    console.log(record.toJSON())

    if (record.tx_hex) {

      // parse script and save in job

    }  else {

      const tx_hex = await fetch(record.txid)

      record.tx_hex = tx_hex

      await record.save()

    }

    if (!record.script) {

      // get tx hex and save in job

    }

  }

}

main()
