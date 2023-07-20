#!/usr/bin/env ts-node

import { bsv } from 'scrypt-ts'

const Run = require('run-sdk')

const blockchain = new Run.plugins.WhatsOnChain({ network: 'main' })

import contracts from '@powco/smart-contracts'

import models from './models'

import { createHash } from 'crypto'

export async function getContractInstanceFromLocation<ContractClass>({ location }: { location: string }): Promise<ContractClass | null> {

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

export async function detetctInstancesFromTxid<ContractClass>(txid: string): Promise<{instances: ContractClass[], txhex: string}> {

  const txhex = await blockchain.fetch(txid)

  const instances: ContractClass[] = await detectInstancesFromTxHex(txhex)

  return {instances, txhex}

}

export async function detectInstancesFromTxHex<ContractClass>(txhex: string): Promise<ContractClass[]> {

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

export async function findOrImportInstanceAtLocation({ location, contract_id }: { location: string, contract_id: string }) {

  console.log('findOrImportInstanceAtLocation', { location, contract_id })

  const Contract = contracts[contract_id]

  if (!Contract) { return }

  try {

    const [txid, vout] = location.split('_')

    const txhex = await blockchain.fetch(txid)

    const tx = new bsv.Transaction(txhex)

    let instance = Contract.fromTx(tx, vout)

    const baseKeys = [
      'enableUpdateEMC',
      '_txBuilders',
      'delegateInstance',
      'from'
    ]

    const props = Object.keys(instance).reduce((_props, key) => {

      if (!baseKeys.includes(key)) {
        _props[key] = instance[key]
      }

      return _props

    }, {})

    let output = tx.outputs[instance.from.outputIndex]

    let script_hash = createHash('sha256').update(Buffer.from(output.script.toHex(), 'hex')).digest('hex').match(/[a-fA-F0-9]{2}/g).reverse().join('')

    let script = output.script.toHex()

    let [record, isNew] = await models.SmartContractInstance.findOrCreate({
      where: {
        location
      },
      defaults: {
        contract_class_id: contract_id,
        origin: location,
        location,
        props,
        value: output.satoshis,
        script_hash,
        script
      }
    })

    return record

  } catch(error) {

    console.error('findOrImportInstanceAtLocation.error', error)

    return;

  }

}

