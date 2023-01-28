
const http = require('superagent')

const { Transaction } = require('bsv')

import { log } from './log'

export async function fetch(txid: string): Promise<string> {

  log.info('junglebus.fetch', { txid })

  const { body } = await http.get(`https://junglebus.gorillapool.io/v1/transaction/get/${txid}`)

  const buffer = Buffer.from(body.transaction, 'base64')

  const hex = buffer.toString('hex')

  log.info('junglebus.fetch.result', { txid, hex })

  const transaction = new Transaction(hex)

  if (transaction.hash !== txid) {
    throw new Error('Junglebus returned incorrect transaction for txid')
  }

  return hex

}
