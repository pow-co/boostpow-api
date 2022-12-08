import { getTransaction } from "./src/powco";

import axios from 'axios'

import { createHash } from 'crypto'

import models from './src/models'

import * as http from 'superagent'

import { fetch } from 'powco'

const faultyJobsJson = require('./data/faulty_old_jobs.json')

interface Outpoint {
    txid: string;
    vout: number;
}

interface FindSpendTransaction extends Outpoint {
    scriptHash?: string;
}

interface SpendTransaction {
    outputs: any[];
    inputs: any[];
    job_vout: number;
    job_txid: string;
    spend_vin: number;
    spend_txid: string;
    time: number;
}

async function getTimestamp(txid: string): Promise<any> {

    let url =`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`
  
    //let {data} = await axios.get(url)

    const {body} = await http.get(url)
  
    return body.time * 1000
  
  }

async function findSpendTransaction({ txid: job_txid, vout: job_vout, scriptHash }: FindSpendTransaction): Promise<SpendTransaction | null> {

    var spendTransaction: SpendTransaction;

    if (!scriptHash) {

        const transaction: any = await getTransaction(job_txid)

        const output = transaction.outputs[job_vout]

        scriptHash = createHash('sha256').update(output._scriptBuffer).digest('hex').match(/.{2}/g).reverse().join("");

    }

    let url = `https://api.whatsonchain.com/v1/bsv/main/script/${scriptHash}/history`

    let { data: history } = await axios.get(url)

    // for each item in the history check if that transaction spends the target transaction

    for (let {tx_hash} of history) {
        
        const transaction: any = await getTransaction(tx_hash)

        for (let vin=0; vin< transaction.inputs.length; vin++) {

            const input = transaction.inputs[vin]

            if (input.prevTxId.toString('hex') === job_txid) {

                spendTransaction = Object.assign(transaction, { job_txid, job_vout, spend_txid: tx_hash, spend_vin: vin })

                break;
            }

            
        }

    }

    return spendTransaction

}

async function main() {

    for (let redemption of faultyJobsJson.message.redemptions) {

        try {

            var [txid, vout] = redemption.outpoint.split(':')

            txid = txid.substring(2)
    
            vout = parseInt(vout)
    
            const job = await models.BoostJob.findOne({
                where: {
                    txid
                }
            })
    
            if (!job || job.spent) { continue }

            const existingProof = await models.BoostWork.findOne({
                where: {
                    job_txid: job.txid,
                    job_vout: job.vout
                }
            })

            if (existingProof) {
                job.spent = true;
                job.spent_txid = existingProof.spend_txid
                job.spent_vout = existingProof.spend_vout

                await job.save()

                continue
            }
    
            const spendTransaction = await findSpendTransaction({
                txid,
                vout
            })

            console.log('JOB', job.toJSON())
    
            if (!spendTransaction) { continue }
    
            const input = spendTransaction.inputs[spendTransaction.spend_vin]
    
            const inputScript = input._scriptBuffer.toString('hex')

            const timestamp = await getTimestamp(spendTransaction.spend_txid)

            const txhex = await fetch(spendTransaction.spend_txid)

            const [proof, isNew] = await models.BoostWork.findOrCreate({
                where: {
                    job_txid: job.txid,
                    job_vout: job.vout
                },
                defaults: {
                    job_txid: job.txid,
                    job_vout: job.vout,
                    spend_txid: spendTransaction.spend_txid,
                    spend_vout: spendTransaction.spend_vin,
                    //script: inputScript,
                    difficulty: job.difficulty,
                    tag: job.tag,
                    timestamp,
                    value: job.value,
                    profitability: job.profitability,
                    content: job.content,
                    tx_hex: txhex
                }
            })

            if (isNew) {

                console.log('New Proof Created', proof.toJSON())

            }
    
        } catch(error) {

            console.error('error', error)

            continue

        }



    }

}

main()

