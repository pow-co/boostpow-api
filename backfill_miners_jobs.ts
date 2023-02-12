
import models from './src/models'

import { fetch } from 'powco'

import { Op } from 'sequelize'

import { BoostPowJob } from 'boostpow'

export default async function main() {

  let records = await models.BoostJob.findAll({
    where: {
      /*minerPubKeyHash: {
        [Op.eq]: null
      },
      */
      tx_hex: {
        [Op.ne]: null
      }
    }
  })

  for (let record of records) {

    const job = BoostPowJob.fromRawTransaction(record.tx_hex)

    if (!job) { continue }

    //console.log(record.tx_hex)

    if (job.minerPubKeyHash) {

      console.log(job.toObject())

    }


  }

  process.exit()

}

main()
