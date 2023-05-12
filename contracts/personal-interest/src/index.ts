#!/usr/bin/env ts-node

import { PersonalInterest } from './contracts/personalInterest'

import { bsv } from 'scrypt-ts'

const Run = require('run-sdk')

const blockchain = new Run.plugins.WhatsOnChain({ network: 'main' })

const txid = 'b0704b4e1e6c6f69f83a430c9d76c564a616e06b163f7eceb78f4a1ed9ebdd30'

export { PersonalInterest }

let initialized = false

export async function init() {

  if (initialized) { return }

  await PersonalInterest.compile()

  initialized = true

}

export async function main() {

  await init()

  let [interests, txhex] = await detectInterestsFromTxid(txid)

  const tx = new bsv.Transaction(txhex)

  console.log(interests, 'interests')

  for (let interest of interests) {

    console.log({
      txid,
      outputIndex: interest.from.outputIndex,
      topic: Buffer.from(interest.topic, 'hex').toString('utf8'),
      owner: new bsv.PublicKey(interest.owner).toAddress().toString(),
      weight: Number(interest.weight),
      value: tx.outputs[interest.from.outputIndex].satoshis
    })

  }

}

export async function detectInterestsFromTxid(txid: string): Promise<[PersonalInterest[], string]> {

  await init()

  const hex = await blockchain.fetch(txid)

  const interests = await detectInterestsFromTxHex(hex)

  return [interests, hex]

}

export async function detectInterestsFromTxHex(txhex: string): Promise<PersonalInterest[]> {

  await init()

  const interests = []

  const tx = new bsv.Transaction(txhex)

  for (let i=0; i < tx.outputs.length; i++) {

    try {

      //@ts-ignore
      const interest = PersonalInterest.fromTx(tx, i)

      interests.push(interest)

    } catch(error) {

    }

  }

  return interests

}

