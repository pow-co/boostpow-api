import * as assert from 'assert'
import { getBoostJob, importBoostProof } from '../src/boost'

import * as boost from 'boostpow'

import { BoostPowJob } from 'boostpow'

describe("Getting Boost Txns From Bitcoin", () => {

  it("#getBoostJob should return the output script", async () => {

    const txid = '82bd7a40671ddd3f8fb0f82a0d93fa06a09d3d4db7b894bec22aa449f4210a2a'

    let job = await getBoostJob(txid)

    assert.strictEqual(job.script, '08626f6f7374706f7775040000003320ca5c6bfd4bdb243e2acfaf4b30811f4df5bae35800000000000000000000000004ffff001d14000000000000000000000000000000000000003304024957a420214edccb3c8bcfad2705bddfbf1c36040d1bf2be59a242cd1c954e956d6f225d7e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac')
    assert.strictEqual(job.content, '00000000000000000000000058e3baf54d1f81304bafcf2a3e24db4bfd6b5cca')
    assert.strictEqual(job.value, 1800)
    assert.strictEqual(job.vout, 0)
    assert.strictEqual(job.difficulty, 1)
    assert.strictEqual(job.category, '00000033')
    assert.strictEqual(job.tag, '0000000000000000000000000000000000000033')
    assert.strictEqual(job.userNonce, '024957a4')
    assert.strictEqual(job.additionalData, '214edccb3c8bcfad2705bddfbf1c36040d1bf2be59a242cd1c954e956d6f225d')

  })

})

describe("serializing boost jobs", () => {

  it("should maintain the difficulty after serializing and de-serializing", () => {

    var job = BoostPowJob.fromObject({
      content: '00000000000000000000000058e3baf54d1f81304bafcf2a3e24db4bfd6b5cca',
      diff: 0.001
    })

    var script = job.toScript().toHex()

    var newJob = BoostPowJob.fromScript(script)

    assert.strictEqual(newJob.difficulty, 0.0010000003662166597)

    job = BoostPowJob.fromObject({
      content: '00000000000000000000000058e3baf54d1f81304bafcf2a3e24db4bfd6b5cca',
      diff: 0.1
    })

    script = job.toScript().toHex()

    newJob = BoostPowJob.fromScript(script)

    assert.strictEqual(newJob.difficulty, 0.1)

  })

})

describe("Boost Job Proofs", () => {

  it("should import a boost proof by txid", async () => {

    const txid = '3a69e3a0431b5619f74b4671d83a87fd1b84d51ca8863063c59965b89250cbd1'

    let record = await importBoostProof(txid)

    console.log('record', record)

    assert.strictEqual(record.spend_txid, txid)
    
  })

  it.skip("should validate that a txid is a valid boost proof", async () => {

  })

  it.skip("should discover the boost job that the proof is spending", async () => {

  })

})
