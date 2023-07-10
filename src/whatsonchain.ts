

import axios from 'axios'

import * as http from 'superagent'

export interface WhatsonchainTransaction {
  txid: string;
  hash: string;
  time: number;
  blocktime: number;
  blockhash: string;
  vin: any[];
  vout: any[];
}

export async function getScriptHistory({ scriptHash }:{ scriptHash: string }): Promise<{tx_hash: string, height: number}[]> {

  let url = `GET https://api.whatsonchain.com/v1/bsv/main/script/${scriptHash}/history`

  const { data } = await axios.get(url)

  return data

}

export async function getTransaction(txid: string): Promise<WhatsonchainTransaction> {

  let url =`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`

  let {body} = await http.get(url)

  return body

}

export interface Block {
  hash: string;
  confirmations: number;
  size: number;
  height: number;
  version: number;
  versionHex: string;
  merkelroot: string;
  txcount: number;
  tx: string[];
  time: number;
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  previousblockhash: string;
  nextblockhash: string;
  coinbaseTx: {
    hex: string;
    txid: string;
    hash: string;
    size: number;
    version: number;
    locktime: number;
    vin: {
      txid: string;
      vout: number;
      scriptSig: {
        asm: string;
        hex: string;
      };
      sequence: number;
      coinbase: string; 
    }[];
    vout: {
      value: number;
      n: number;
      scriptPubKey: {
        asm: string;
        hex: string;
        reqSigs: number;
        type: number;
        addresses: string[];
        opReturn: string;
      }
    }[];
    blockhash: string;
    confirmations: number;
    time: number;
    blocktime: number;
  }
  totalFees: number;
  miner: string;
  pages: any;
}


export async function getBlockByHeight({ height }: { height: number }): Promise<Block> {

  let url = `https://api.whatsonchain.com/v1/bsv/main/block/height/${height}`

  let {data} = await axios.get(url)

  return data

}


export async function getBlockByHash({ hash }): Promise<Block> {

  let url =`https://api.whatsonchain.com/v1/bsv/main/block/hash/${hash}`

  let {data} = await axios.get(url)

  return data

}

export interface GetBlockPages {
  number: number;
  hash: string;
}

export async function getBlockPages({ hash, number }: GetBlockPages): Promise<WhatsonchainTransaction> {

  let url = `https://api.whatsonchain.com/v1/bsv/main/block/hash/${hash}/page/${number}`

  let response = await axios.get(url)

  return response.data

}
