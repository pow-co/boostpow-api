
import { Op } from 'sequelize'

import models from '../models'

import { getTransactionHex as fetch } from '../powco'

import { detectInterestsFromTxid } from '../../contracts/personal-interest/src'

import { PersonalInterest } from '../../contracts/personal-interest/dist/src/contracts/personalInterest'

const abi = require('../../contracts/personal-interest/artifacts/src/contracts/personalInterest.json')

PersonalInterest.loadArtifact(abi)

import * as bsv from 'bsv'

const { createHash } = require('crypto');

export async function main() {

  const interests = await models.PersonalInterest.findAll({

    where: {

      script_hash: {

        [Op.eq]: null

      }

    }

  })

  for (let interest of interests) {

    // look up script hash

    const [txid, vout] = interest.location.split('_')

    const transaction = await fetch(txid)

    const instances = detectInterestsFromTxHex(transaction)

    for (let instance of instances) {

      console.log(instance)
  
    }

    if (instances.length == 1) {

      let instance = instances[0]

      interest.script = instance.script

      interest.script_hash = instance.script_hash

      interest.location = `${instance.txid}_${instance.vout}`

      await interest.save()

    }

    //const instances = await detectInterestsFromTxid(txid)

    //for (let instance of instances) {

     // console.log(instance)

    //}

  }

}

export function detectInterestsFromTxHex(txhex: string): {interest:PersonalInterest, vout: number, script: string, script_hash: string, txid: string}[] {

  const interests = []

  const tx = new bsv.Transaction(txhex)

  for (let i=0; i < tx.outputs.length; i++) {

    try {

      //@ts-ignore
      const interest = PersonalInterest.fromTx(tx, i)

      const output = tx.outputs[i]

      let script_hash = createHash('sha256').update(Buffer.from(output.script.toHex(), 'hex')).digest('hex').match(/[a-fA-F0-9]{2}/g).reverse().join('')

      interests.push({interest, vout: i, script: output.script.toHex(), script_hash, txhex, txid: tx.hash })

    } catch(error) {

      //console.error(error)

    }

  }

  return interests

}

if (require.main === module) {

  main()

}
