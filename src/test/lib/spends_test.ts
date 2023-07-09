
import { getSpendingTransaction } from '../../spends'
import { expect } from '../utils'

describe("Spends", () => {

    it.skip("#getSpendingTransaction should get return the spending txid and index for a spent output", async () => {

        const spent = {
            hash: "6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e",
            index: 2
        }

        const { input, output } = await getSpendingTransaction(spent)

        expect(input.hash).to.be.equal('053fa2c9851635b5080dc7906c4ee0ca637e7633f959b04f0cb6a93afe6d5a67')
        expect(input.index).to.be.equal(1)

        expect(output.hash).to.be.equal(spent.hash)
        expect(output.index).to.be.equal(spent.index)

    })

    it.skip("#getSpendingTransaction should get return spent:false for a yet unspent output", async () => {

        const unspent = {
            hash: '07d5a9f803f8279471b64d39f07fafbf27fecd71f5f9350e1b43d2b2373352be',
            index: 3
        }

        const result = await getSpendingTransaction(unspent)

        expect(result).to.be.equal(undefined)

    })
})