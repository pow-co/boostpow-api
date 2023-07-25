require('dotenv').config()

import models from '../models'

import { Op } from 'sequelize'

import BigNumber from 'bignumber.js'

async function run () {

  let jobs = await models.BoostJob.findAll({

    where: {

      profitability: {

        [Op.eq]: null

      }

    }
  })

  console.log(jobs.length, "JOBS FOUND")

  for (let job of jobs) {

    const profitability = new BigNumber(job.value).dividedBy(job.difficulty).toNumber()

    job.profitability = profitability

    await job.save()

    console.log(job.toJSON())

  }

}

run()
