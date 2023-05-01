

import * as bsv from 'bsv'

import models from '../models'

import { badRequest } from 'boom'

import { detectInterestsFromTxid, detectInterestsFromTxHex } from '../../contracts/personal-interest/src'

export async function findOrImportPersonalInterests(txid: string):Promise<any[]> {

  let records = await models.PersonalInterest.findAll({where: { origin: txid }})

  if (records.length == 0){

    let [interests, txhex] = await detectInterestsFromTxid(txid)

    const tx = new bsv.Transaction(txhex)

    for (let interest of interests){

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
