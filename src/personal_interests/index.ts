

import * as bsv from 'bsv'

import models from '../models'

import { badRequest } from 'boom'

import { detectInterestsFromTxid, detectInterestsFromTxHex } from '../../contracts/personal-interest/src'

import { getTransaction, getScriptHistory } from '../whatsonchain'

export async function findOrImportPersonalInterests(txid: string, opts: {rescan:boolean}={rescan: false}):Promise<any[]> {

  let records = await models.PersonalInterest.findAll({where: { origin: txid }})

  if (records.length == 0){

    let [interests, txhex] = await detectInterestsFromTxid(txid)

    const tx = new bsv.Transaction(txhex)

    for (let interest of interests){

      console.log(interest)

      let record = await models.PersonalInterest.create({
        origin: txid,
        location: txid,
        topic: Buffer.from(interest.topic, 'hex').toString('utf8'),
        owner: new bsv.PublicKey(interest.owner).toAddress().toString(),
        weight: Number(interest.weight),
        value: tx.outputs[interest.from.outputIndex].satoshis,
        active:true
      })

      records.push(record)
    }

  }

  return records

}

interface RemoveInterest {
  current_location: string;
  removal_location: string;
}

export async function removeInterest(args: RemoveInterest) {

  const [current_txid, current_vout] = args.current_location.split('_')

  const interest = await models.PersonalInterest.findOne({ where: { location: args.current_location }})

  if (interest.removal_location) { throw new Error("Removal of Interest Already Processed") }

  if (!interest) { throw new Error("Interest Not Found") }

  if (!interest.script_hash) { throw new Error("Interest Record Missing Script Hash") }

  const history = await getScriptHistory({ scriptHash: interest.script_hash })

  const spends: any[] = await Promise.all(history.map(async ({ tx_hash }) => {

    if (tx_hash === current_txid) { return [] }

    const transaction = await getTransaction(tx_hash)

    const matches = transaction.vin.filter(({txid, vout}) => {

      return txid == current_txid && vout == current_vout

    })

    return matches

  }))

  const spend = spends.flat()[0]

  if (!spend) { throw new Error('Transaction Does Not Remove Interest From Its Current Location') }

  interest.removal_location = args.removal_location

  interest.active = false

  await interest.save()

  return interest

}

