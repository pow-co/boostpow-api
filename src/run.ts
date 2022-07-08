
import { log } from './log'

const Run = require('run-sdk')

export const run = new Run({ network: 'main' })

export async function broadcast(txhex) {

  let response = await run.blockchain.broadcast(txhex)

  log.info('run.blockchain.broadcast', { txhex,  response })

  return response

}
