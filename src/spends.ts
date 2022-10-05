require("dotenv").config()

import { log } from './log'

import { Crawler } from '../planaria/crawler'

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