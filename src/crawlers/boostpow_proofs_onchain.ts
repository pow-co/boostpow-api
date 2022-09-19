
import { log } from '../log'

import { OnchainTransaction } from '../onchain';

import models from '../models'

import { importBoostProofByTxid } from '../boost'

const queue = require('fastq')(async (json, callback) => {

  log.info('boostpow_proofs_onchain', json)

  const tx_id = json.value.tx_id || json.tx_id

  const tx_index = json.value.tx_index || json.tx_index

  const jobRecord = await models.BoostWork.findOne({
    where: {
      spend_txid: tx_id,
      spend_vout: tx_index
    }
  })

  if (jobRecord) {

    log.info('models.BoostWork.found', jobRecord.toJSON())

  } else {

    await importBoostProofByTxid(tx_id)

  }

  callback(null, json)

}, 1)

const app_id = '18pPQigu7j69ioDcUG9dACE1iAN9nCfowr'

export const query = {
  "out.s2": "onchain",
  "out.s3": app_id
}


export async function onTransaction(json) {

  let outputs = json.out
    .filter(({s2}) => s2 === 'onchain')
    .filter(({s3}) => s3 === app_id)
    .filter(({s4}) => s4 === 'proof')

    outputs.map(output => {

      var value = output['s5']

      if (typeof value === 'string') {

          value = JSON.parse(value)

      }

      let message: OnchainTransaction = {
          tx_id: json['tx']['h'],
          tx_index: output['i'],
          app_id: output['s3'],
          key: output['s4'],
          value,
          nonce: output['s6'],
          author: output['s7'],
          signature: output['s8'],
          source: 'bitbus'
      }

      log.info('planaria.boostpow.proof', message)

      queue.push(message)

    })

}

