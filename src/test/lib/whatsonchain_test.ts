
import * as whatsonchain from '../../whatsonchain'

import { expect } from '../utils'

describe("Whatsonchain API", () => {

    it("#getTransaction should return tx hex given a txid", async () => {

        const result = await whatsonchain.getTransaction('8db59c48e77614e7db5c73a95b0705f312dd88aa2c2f83d71bffd931926d29e9')

        console.log(result)

        expect(result)

    })

    it('getBlockByHash should get a block by hash', async () => {

        const hash = '000000000000000004a288072ebb35e37233f419918f9783d499979cb6ac33eb'

        const result = await whatsonchain.getBlockByHash({ hash })

        expect(result.hash).to.be.equal(hash)

    })

    it("getBlockByHeight should get the block by height", async () => {

        const height = 700_000

        const result = await whatsonchain.getBlockByHeight({ height })

        expect(result.height).to.be.equal(height)

    })

    it("getBlockPages should transactions in a block with more than 100", async () => {

        const hash = '000000000000000000885a4d8e9912f085b42288adc58b3ee5830a7da9f4fef4'

        const result = await whatsonchain.getBlockPages({
            hash,
            number: 1
        })

        expect(result[0]).to.be.equal('51c4933d986da4c0de51ea8446b7db4aa1753f205c594591a09998b1d05d7cfe')
        
    })
    
})
