
import * as http from 'superagent'

interface WhatsonchainTransaction {
  txid: string;
  hash: string;
  time: number;
  blocktime: number;
  blockhash: string;
  vin: any[];
  vout: any[];
}

export async function getTransaction(txid: string): Promise<WhatsonchainTransaction> {

  let url =`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`

  let {body} = await http.get(url)

  return body

}

