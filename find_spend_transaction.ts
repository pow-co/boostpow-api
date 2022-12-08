import { getTransaction } from "./src/powco";

import axios from 'axios'

import { createHash } from 'crypto'

import models from './src/models'

const faultyJobsJson = require('./data/faulty_old_jobs.json')

interface Outpoint {
    txid: string;
    vout: number;
}

interface FindSpendTransaction extends Outpoint {
    scriptHash?: string;
}

interface SpendTransaction {

}

async function findSpendTransaction({ txid, vout, scriptHash }: FindSpendTransaction): Promise<SpendTransaction | null> {

    var spendTransaction: SpendTransaction;

    if (!scriptHash) {

        const transaction = await getTransaction(txid)

        const output = transaction.outputs[vout]

        scriptHash = createHash('sha256').update(output._scriptBuffer).digest('hex').match(/.{2}/g).reverse().join("");

        console.log({ scriptHash })

    }

    let url = `https://api.whatsonchain.com/v1/bsv/main/script/${scriptHash}/history`

    let { data: history } = await axios.get(url)

    // for each item in the history check if that transaction spends the target transaction

    for (let {tx_hash} of history) {
        
        const transaction = await getTransaction(tx_hash)


        for (let vout=0; vout< transaction.inputs.length; vout++) {

            const input = transaction.inputs[vout]

            if (input.prevTxId.toString('hex') === txid) {

                spendTransaction = Object.assign(transaction, { txid, vout })

                break;
            }

            
        }

    }

    return spendTransaction

}

async function main() {

    //const scriptHash = '19f28bce6a9eccc35dc1aebfab16972481fedb6f8405edd5b624d94a228803b4'

    for (let redemption of faultyJobsJson.message.redemptions) {

        console.log(redemption)

        var [txid, vout] = redemption.outpoint.split(':')

        txid = txid.substring(2)

        const job = await models.BoostJob.findOne({
            where: {
                txid
            }
        })

        const spendTransaction = await findSpendTransaction({
            txid,
            vout,
            //scriptHash
        })

        console.log({spendTransaction})

    }


}

main()

