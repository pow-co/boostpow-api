require('dotenv').config()

import { expect } from './utils'

import { Miner, powco } from 'boostminer'

import { buildBoostJob, buildBoostJobTransaction, submitBoostJobTx, getBoostJob } from '../src/api_client'

import { loadWallet } from 'anypay-simple-wallet'

import * as boostpow from 'boostpow'

import * as bsv from 'bsv'

describe('End to End Boost Tests with HTTP API Client', () => {
  
  it('uses the api to create a new boost job script', async () => {

    let script: string = await buildBoostJob({
      content: '0d1a0054499b6d4cc5e95adef0304ee588465485471fd740ca8e4fced2b346c7',
      diff: 0.0001
    })

    expect(script).to.be.a('string')//equal('08626f6f7374706f7775040000000020c746b3d2ce4f8eca40d71f4785544688e54e30f0de5ae9c54c6d9b4954001a0d04d80f271e0004093c1cf5007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac')

  })

  it.skip('constructs a live transaction, submits to the jobs api, and is correctly added to the jobs list', async () => {

    let script: string = await buildBoostJob({
      content: '0d1a0054499b6d4cc5e95adef0304ee588465485471fd740ca8e4fced2b346c7',
      diff: 0.0001
    })

    let wallet = (await loadWallet()).holdings[0]

    let balance = await wallet.balance()

    console.log('wallet balance: ', balance)

    let outputs = wallet.unspent

    const tx = new bsv.Transaction().from(wallet.unspent).change(wallet.address)

    tx.addOutput(
      bsv.Transaction.Output({
        script,
        satoshis: 1000
      })
    )

    let privatekey = new bsv.PrivateKey(wallet.privatekey)

    tx.sign(privatekey)

    let result = await submitBoostJobTx(tx.serialize())

    console.log('submitboostjobtx.result', result)

    const miner = new Miner({
      privatekey: wallet.privatekey,
      address: wallet.address
    })

    console.log(miner)

    let solution = await miner.workJob(tx.hash)

    console.log('solution', solution)

    let { work } = await powco.submitBoostProofTransaction(solution.txhex)

    console.log('final response', work)

    let job = await getBoostJob(tx.hash)

    console.log('final job', job)

    expect(job.spent).to.be.equal(true)
    expect(job.spent_txid).to.be.equal(work.spend_txid)
    expect(job.spent_vout).to.be.equal(work.spend_vout)

  })

  it.skip('uses boostminer-js to boost the transaction, submits the work to the work api, and is marked complete', async () => {

    try {

      let wallet = await loadWallet()

      const miner = new Miner({
        privatekey: wallet.privatekey,
        address: wallet.address
      })

      const [txid, vout] = ['48e2a6ab3d2c61c4f0125b7bd51232957622038dd0fac5714b0800f3f723a224', 0]

      let solution = await miner.workJob(txid)

      console.log({ solution })

      let response = await powco.submitBoostProofTransaction(solution.txhex)

      console.log(response)

    } catch(error) {

      console.error(error)

    }

  })

})
