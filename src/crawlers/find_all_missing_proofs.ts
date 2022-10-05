import { importBoostProofByTxid } from "../boost"
import { getSpendingTransaction } from "../spends"
import { log } from "../log"
import models from "../models"

export default async function start() {

    const jobs = await models.BoostJob.findAll({
        where: {
            spent: false
        },
        order: [["createdAt", "desc"]]
    })

    for (let job of jobs) {

        const output = { hash: job.txid, index: job.vout }

        const result = await getSpendingTransaction(output)


        if (result) {

            log.info('output.spent', result)

            const proof = await importBoostProofByTxid(result.input.hash)

            log.info('proof.imported', proof)


        } else {

            log.info('output.unspent', {output})

        }
        
    }

}

if (require.main === module) {

  start()

}
