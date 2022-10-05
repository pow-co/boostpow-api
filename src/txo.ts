
import * as txo from 'txo'

import { getTransaction } from './powco'

export async function txoFromTxid(txid: string): Promise<any> {

  let { hex } = await getTransaction(txid)

  return txo.fromTx(hex)

}
