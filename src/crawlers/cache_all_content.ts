
require('dotenv').config()

import models from '../models'

import { cacheContent } from '../content';

export default async function start() {

    const jobs = await models.BoostJob.findAll();

    const proofs = await models.BoostWork.findAll();

    (async () => {

        for (let job of jobs) {
            await cacheContent(job.content)
        }

    })();


    (async () => {

        for (let proof of proofs) {
            await cacheContent(proof.content)
        }

    })();

}

if (require.main === module) {

  start()

}
