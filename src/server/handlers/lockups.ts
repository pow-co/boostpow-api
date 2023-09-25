import { badRequest } from 'boom'

import { bsv } from 'scrypt-ts'

import { Lockup } from '../../contracts/lockup'

import { fetchTransaction } from '../../whatsonchain'
import  models  from "../../models"

import { sequelize } from '../../models'
import { Op } from 'sequelize'
import axios from 'axios'

interface Ranking {
    txid: string;
    lockups: any[];
}

export async function index(req) {

    try {

        const chainInfo = await axios.get('https://api.whatsonchain.com/v1/bsv/main/chain/info')

        const currentBlock = chainInfo.data.blocks
        
        const { limit, offset, start, end } = req.query

        const where = {
            class_name: 'Lockup',
            props: {
                lockUntilHeight: {
                    [Op.gt]: currentBlock
                }
            }
        }

        if (start){
            
            where['timestamp'] = {
                [Op.gte]: new Date(start * 1000)
            }

        }

        if (end){
            
            where['timestamp'] = {
                [Op.lte]: new Date(end * 1000)
            }
            
        }

        const lockups = await models.SmartContract.findAll({
            where,
            limit, 
            offset,
            attributes: [
                'origin',
                'location',
                'props',
                'txid',
                'vout',
                'balance',
                'timestamp',
                [sequelize.literal('(balance * LN("props"."lockUntilHeight") * 10)'), 'vibes'], 
            ],
            order: [
                ['vibes', 'DESC']
            ]
        })

        const txids = lockups.map((lockup) => lockup.txid);

        const content = await models.Content.findAll({
        where: {
            txid: {
            [Op.in]: txids,
            },
        },
        });
        const rankings: Ranking[] = []

        for (const lockup of lockups) {
            const lockupContent = content.find((c) => c.txid === lockup.txid);
            let lockupTxid = ''
            if (lockupContent.bmap.MAP[0].type === "like"){
                lockupTxid = lockupContent.bmap.MAP[0].tx
            } else {
                lockupTxid = lockup.txid
            }

            // Check if lockupTxid already exists in rankings
            const existingRanking = rankings.find((ranking) => ranking.txid === lockupTxid);

            if (existingRanking) {
                // If the txid already exists, add the current lockup to its lockup array
                existingRanking.lockups.push(lockup);
            } else {
                // If the txid doesn't exist, create a new ranking entry
                rankings.push({
                txid: lockupTxid,
                lockups: [lockup],
                });
            }

            
        }

        // Sort the rankings array based on the sum of all lockup vibes in descending order
        rankings.sort((a, b) => {
            const sumVibesA = a.lockups.reduce((acc, lockup) => acc + lockup.vibes, 0);
            const sumVibesB = b.lockups.reduce((acc, lockup) => acc + lockup.vibes, 0);
        
            return sumVibesB - sumVibesA;
        });

        return { rankings }

    } catch (error) {

        console.log(error)

        return badRequest(error)
        
    }
}

export async function byAddress(req) {

    try {
        
        const chainInfo = await axios.get('https://api.whatsonchain.com/v1/bsv/main/chain/info')

        const currentBlock = chainInfo.data.blocks
        
        const { limit, offset, start, end } = req.query

        const { address } = req.params

        const where = {
            class_name: 'Lockup',
            props: {
                lockUntilHeight: {
                    [Op.gt]: currentBlock
                },
                pkhash: {[Op.eq]: address}
            }
        }

        if (start){
            
            where['timestamp'] = {
                [Op.gte]: new Date(start * 1000)
            }

        }

        if (end){
            
            where['timestamp'] = {
                [Op.lte]: new Date(end * 1000)
            }
            
        }

        const lockups = await models.SmartContract.findAll({
            where,
            limit, 
            offset,
            attributes: [
                'origin',
                'location',
                'props',
                'txid',
                'vout',
                'balance',
                'timestamp',
                [sequelize.literal('(balance * LN("props"."lockUntilHeight") * 10)'), 'vibes'], 
            ],
            order: [
                ['vibes', 'DESC']
            ]
        })

        const txids = lockups.map((lockup) => lockup.txid);

        const content = await models.Content.findAll({
        where: {
            txid: {
            [Op.in]: txids,
            },
        },
        });
        const rankings: Ranking[] = []

        for (const lockup of lockups) {
            const lockupContent = content.find((c) => c.txid === lockup.txid);
            let lockupTxid = ''
            if (lockupContent.bmap.MAP[0].type === "like"){
                lockupTxid = lockupContent.bmap.MAP[0].tx
            } else {
                lockupTxid = lockup.txid
            }

            // Check if lockupTxid already exists in rankings
            const existingRanking = rankings.find((ranking) => ranking.txid === lockupTxid);

            if (existingRanking) {
                // If the txid already exists, add the current lockup to its lockup array
                existingRanking.lockups.push(lockup);
            } else {
                // If the txid doesn't exist, create a new ranking entry
                rankings.push({
                txid: lockupTxid,
                lockups: [lockup],
                });
            }

            
        }

        // Sort the rankings array based on the sum of all lockup vibes in descending order
        rankings.sort((a, b) => {
            const sumVibesA = a.lockups.reduce((acc, lockup) => acc + lockup.vibes, 0);
            const sumVibesB = b.lockups.reduce((acc, lockup) => acc + lockup.vibes, 0);
        
            return sumVibesB - sumVibesA;
        });

        return { rankings }

    } catch (error) {

        console.log(error)

        return badRequest(error)
        
    }
}


export async function show(req) {

    try {
        
        const [txid, vout] = req.params.origin.split('_')

        const txhex = await fetchTransaction({ txid })

        const tx = new bsv.Transaction(txhex)

        console.log({ tx })

        const lockup = Lockup.fromTx(tx, vout || 0)

        console.log({ lockup })

        const result = {
            address: lockup.pkhash.toString(),
            blockHeight: Number(lockup.lockUntilHeight),
            satoshis: tx.getOutputAmount(vout || 0),
            origin: req.params.origin,
        }

        console.log(result)

        const [record] = await models.SmartContract.findOrCreate({
            where: {
                origin: req.params.origin,
                class_name: 'Lockup'
            },
            defaults: {
                origin: req.params.origin,
                class_name: 'Lockup',
                props: {
                    lockUntilHeight: Number(lockup.lockUntilHeight),
                    pkhash: lockup.pkhash.toString(),
                }
            }
        })

        console.log(record.toJSON())

        return {
            lockup: result
        }

    } catch (error) {

        console.log(error)

        badRequest(error)
        
    }
}

