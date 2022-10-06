
import * as boost from '../../boost'
import { expect } from '../utils'

describe("Boost Utilities", () => {

    it.skip('#getBoostJobsFromTxHex should return jobs from a txhex', async () => {

        const result = await boost.getBoostJobsFromTxHex('')

    })

    it('#getBoostJobsFromTxid should return jobs given a txid', async () => {

        const result = await boost.getBoostJobsFromTxid('6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e')

        expect(result)

    })

    it('#getBoostProof should return a proof given a txid', async () => {

        const result = await boost.getBoostProof('d1d26fa621f87dfc82ed1d8aa765b35172d04b32297025e5fa4df8044a829f92')

        expect(result)

    })

    it.skip('#persistBoostJob should take a BoostPowJob and return a database record object', async () => {

       // const result = await boost.persistBoostJob('')

    })

    it.skip('#getBoostJob should get a boost job given a txid', async () => {

        const result = await boost.getBoostJob('6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e')

        expect(result)

    })

    it('#importBoostProofByTxid should return a proof given a txid', async () => {

        const result = await boost.importBoostProofByTxid('d1d26fa621f87dfc82ed1d8aa765b35172d04b32297025e5fa4df8044a829f92')

        expect(result)

    })

    it.skip('#importBoostProofFromTxHex should call importBoostProof to import', async () => {

        const result = await boost.importBoostProofFromTxHex('')

    })

    it.skip("#importBoostProof should import a proof transaction by hex", async () => {

        //const result = await boost.importBoostProof({ tx_hex: '' })

    })

    it('#importBoostJobFromTxid should import job from txid', async () => {

        const result = await boost.importBoostJobFromTxid('6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e')

        expect(result)

    })

})
