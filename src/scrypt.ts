
#!/usr/bin/env ts-node

import { bsv } from 'scrypt-ts'

const Run = require('run-sdk')

const blockchain = new Run.plugins.WhatsOnChain({ network: 'main' })

export async function getContractInstanceFromLocation<ContractClass>({ location }: { location: string }): Promise<ContractClass | null> {

  await init()

  const [txid, vout] = location

  const hex = await blockchain.fetch(txid)

  const tx = new bsv.Transaction(hex)

  try {

    //@ts-ignore
    let instance = ContractClass.fromTx(tx, vout)

    return instance

  } catch(error) {

  }

}

export async function detetctInstancesFromTxid<ContractClass>(txid: string): Promise<[instances: ContractClass[], txhex: string]> {

  await init()

  const txhex = await blockchain.fetch(txid)

  const instances = await detectInstancesFromTxHex(hex)

  return {instances, txhex}

}

export async function detectInstancesFromTxHex<ContractClass>(txhex: string): Promise<ContractClass[]> {

  await init()

  const instances = []

  const tx = new bsv.Transaction(txhex)

  for (let i=0; i < tx.outputs.length; i++) {

    try {

      //@ts-ignore
      const instance = ContractClass.fromTx(tx, i)

      instances.push(instance)

    } catch(error) {

    }

  }

  return instances

}

