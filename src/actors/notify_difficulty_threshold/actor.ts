/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';
import models from '../../models';

const THRESHOLD = 10

import { notifyThreshold } from '../../thresholds'

export async function start() {

  Actor.create({

    exchange: 'proofofwork',

    routingkey: 'boost_job_mined',

    queue: 'slack_boost_job_mined',

    schema: Joi.object() // optional, enforces validity of json schema

  })
  .start(async (channel, msg, json) => {

    // find the total difficulty for the content, subtract the recent difficulty, see if exceeded 10

    const proofs = await models.BoostProof.findAll({
      where: {
        content: json.content
      }
    })

    const total = proofs.reduce((acc, proof) => {
      return acc + parseFloat(proof.difficulty)
    }, 0)

    const before = total - parseFloat(json.difficulty)

    if (total >= THRESHOLD && before < THRESHOLD) {

      // threshold exceeded!

      const thresholds = await models.Thresholds.findAll({
        where: {
          value: {
            [models.Sequelize.Op.gte]: before,
            [models.Sequelize.Op.lte]: total
          }
        }
      })

      for (let threshold of thresholds) {

        notifyThreshold(threshold, json)
      }

    }

    log.info(msg.content.toString());

    log.info(json);

  });

}

if (require.main === module) {

  start();

}

