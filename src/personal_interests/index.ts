

import * as bsv from 'bsv'

import models from '../models'

import { badRequest } from 'boom'

import { detectInterestsFromTxid, detectInterestsFromTxHex } from '../../contracts/personal-interest/src'

import { fetchTransaction, getTransaction, getScriptHistory } from '../whatsonchain'

import { publish } from 'rabbi'

import config from '../config'

import { detectInterestsFromTxHex as detect } from './get_script_hashes'

export async function ingestInterest({ current_location }) {

  return findOrImportPersonalInterests(current_location)

}

export async function findOrImportPersonalInterests(location: string, opts: {rescan:boolean}={rescan: false}):Promise<any[]> {

  let [txid] = location.split('_')

  let records = await models.SmartContractInstance.findAll({where: { location }})

  if (records.length == 0){

    const txhex = await fetchTransaction({txid})

    let interests = await detect(txhex)

    for (let _interest of interests) {

      const { interest, script_hash, script } = _interest

      const tx = new bsv.Transaction(txhex)

      let record = await models.SmartContractInstance.create({
        contract_class_id: 'personal-interest',
        origin: location,
        location,
        topic: Buffer.from(interest.topic, 'hex').toString('utf8'),
        owner: new bsv.PublicKey(interest.owner).toAddress().toString(),
        weight: Number(interest.weight),
        value: tx.outputs[interest.from.outputIndex].satoshis,
        active:true,
        script_hash,
        script
      })

      publishInterestCreated(record)

      records.push(record)
    }

  } else {

    for (let record of records) {

      let [txid, _vout] = record.location.split("_")

      if (!record.script_hash) {

        console.log('NO SCRIPT HASH')

        const txhex = await fetchTransaction({txid})

        let interests = await detect(txhex)

        console.log({interests})

        for (let _interest of interests){

          const { interest, script_hash, script, vout } = _interest

          if (vout === _vout) {

            record.script = script

            record.script_hash = script_hash

            await record.save()

          }

        }

      }
   }


  }

  return records

}

interface RemoveInterest {
  current_location: string;
}

interface GetSpend {
  script_hash: string;
  txid: string;
  vout: number;
}

export async function getSpend(args: GetSpend): Promise<{txid:string,vin:number} | null> {

  const history = await getScriptHistory({ scriptHash: args.script_hash })

  const spends: any[] = await Promise.all(history.map(async ({ tx_hash }) => {

    if (tx_hash === args.txid) { return null }

    const transaction = await getTransaction(tx_hash)

    const matches = transaction.vin.map((vin, index) => {

      return Object.assign(vin, { index })

    }).filter((vin, index) => {

      return vin.txid == args.txid && vin.vout == args.vout

    })

    let match = matches[0]

    if (!match) return;

    return {
      txid: tx_hash,
      vin: match.index 
    }

  }))

  const spend = spends.flat().filter(s => !!s)[0]

  return spend

}

export async function getRemoval(args: { current_location: string }): Promise<[record: any, removal: {txid:string,vin:number}]> {

  const { current_location } = args

  const [current_txid, _current_vout] = current_location.split('_')

  const current_vout = parseInt(_current_vout)

  const interest = await models.SmartContractInstance.findOne({ where: { location: args.current_location }})

  if (interest.removal_location) {
    let { txid, vin } = interest.removal_location

    return [interest, {
      txid, vin
    }]
  }

  if (!interest) { throw new Error("Interest Not Found") }

  if (!interest.script_hash) { throw new Error("Interest Record Missing Script Hash") }

  const spend = await getSpend({
    vout: current_vout,
    txid: current_txid,
    script_hash: interest.script_hash
  })

  return [interest, spend]
}


export async function removeInterest(args: RemoveInterest) {

  const { current_location } = args 

  const [interest, spend] = await getRemoval({ current_location })

  if (interest.removal_location) { return interest }

  if (!spend) { throw new Error('Transaction Does Not Remove Interest From Its Current Location') }

  interest.removal_location = `${spend.txid}_${spend.vin}`

  interest.active = false

  await interest.save()

  publishRemoval(interest)

  return interest

}

async function publishRemoval(interest: any) {

  console.log('publishRemoval?')

  if (config.get('amqp_url')) {

    console.log('publishRemoval:', true)

    publish('powco', 'personal-interest.removed', interest.toJSON())

  }

}

async function publishInterestCreated(interest: any) {

  console.log('publishInterestCreated?')

  if (config.get('amqp_url')) {

    console.log('publishInterestCreated:', true)

    publish('powco', 'personal-interest.created', interest.toJSON())

  }

}

