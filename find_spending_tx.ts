require("dotenv").config()

import { log } from './src/log'

import { Crawler } from './planaria/crawler'
import { txoFromTxid } from './src/txo';
import models from './src/models';
import { importBoostProofByTxid } from './src/boost';

interface Script {
    hash: string;
    index: number;
}

interface Input {
    i: number;
    seq: number;
    e: {
        h: string;
        i: number;
    }
}

interface Output {}

interface PlanariaResult {
    _id: string;
    tx: {
        h: string;
    };
    in: Input[];
    out: Output[];
}

interface GetSpendingTransactionResult {
    input: Script;
    output: Script;
}

export async function getSpendingTransaction(output: Script): Promise<GetSpendingTransactionResult | null> {

    log.info('planaria.getSpendingTransaction', { output })

    const crawler = new Crawler({

        query: {
            "in.e.h": output.hash,
            "in.e.i": output.index
        },

        block_index_start: 0,

        onTransaction: (transaction: PlanariaResult) => {

            try {

                const input = transaction.in.filter(input => {
                    return input.e.h === output.hash && input.e.i === output.index
                })[0]

                if (input) {

                    return ({
                        input: {
                            hash: transaction.tx.h,
                            index: input.i
                        },
                        output
                    })

                }

            } catch(error) {

                log.error('planaria.find_spending_tx.error', error)

                throw error
            
            }

        }
    })
    
    const result = await crawler.runOnceFromStart<GetSpendingTransactionResult>()

    return result[0]

}

export default async function start() {

    const jobs = await models.BoostJob.findAll({
        where: {
            spent: false
        }
    })

    for (let job of jobs) {

        //console.log(job.toJSON())

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

    try {

        const output = {
            hash: '6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e',
            index: 0
        }


    } catch(error) {

        log.error('getSpendingTransaction.error', error)

    }

}

if (require.main === module) {

  start()

}
