
import { importer, loaded } from '../../src/importer'
import models from '../../src/models'
import { expect } from '../utils'

describe('Unmined Jobs Processor', () => {

  before(async () => {

    await loaded()

  })

  it("should import a matching proof spending a job output", async () => {

    const proof_tx_hex = "0200000001e1fde36ac18ce289dd8ed07c90424690f75fd59772cc9ae9305a891ab08895d10000000098483045022100b8a9cae7d3346c7aca4344d4fc0cd17ee93e1ed713a7d05274a4182c43c207cd02205ccc0aebbe7794ffa0959b243f7fa07c68493bfa7040ae852dc255319fd3325d412102f70cba8dfa2f23705c012c50a520ac0ac0fe61d2aec04a8c0b804f613348906e04076302000485a3d062086dbfa8a17b639b16040fc53a2214e8ee1688b47895f0e485ea0167c4eada12f6c579ffffffff019a260000000000001976a914e8ee1688b47895f0e485ea0167c4eada12f6c57988ac00000000"

    const { proof } = await importer.importProof(proof_tx_hex)

    const record = await models.BoostWork.findOne({
      where: {
        tx_hex: proof_tx_hex
      }
    })

    expect(record.tx_hex).to.be.equal(proof_tx_hex)

    expect(record.txid)

    expect(proof)

  })

})
