import { expect } from '../utils'
import * as boost from '../../boost'
import { run } from '../../run'

import { BoostPowJob } from 'boostpow'

describe("Boost Utilities", () => {

    it('#getBoostJobsFromTxHex should return jobs from a txhex', async () => {

        const txhex = await run.blockchain.fetch('6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e')

        const result = await boost.getBoostJobsFromTxHex(txhex)

        expect(result[0].difficulty).to.be.equal(1)

    })

    it('#getBoostJobsFromTxid should return jobs given a txid', async () => {

        const result = await boost.getBoostJobsFromTxid('6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e')

        expect(result)

    })

    it('#getBoostProof should return a proof given a txid', async () => {

        const result = await boost.getBoostProof('d1d26fa621f87dfc82ed1d8aa765b35172d04b32297025e5fa4df8044a829f92')

        expect(result)

    })

    it('#importBoostJob should import a boost job', async () => {

        try {

            const txhex = await run.blockchain.fetch('b740679666126027ca342d1fa180e22a5487b55932b05eb5c921214729169862')

            const job = BoostPowJob.fromRawTransaction(txhex)

            await boost.importBoostJob(job)

            await boost.importBoostJob(job, 'b740679666126027ca342d1fa180e22a5487b55932b05eb5c921214729169862')

        } catch(error) {

            console.error(error)

        }
    
    })

    it('#importBoostProofByTxid should return a proof given a txid', async () => {

        const result = await boost.importBoostProofByTxid('d1d26fa621f87dfc82ed1d8aa765b35172d04b32297025e5fa4df8044a829f92')

        expect(result).to.be.not.null

    })

    it('#importBoostJobFromTxid should import job from txid', async () => {

        const result = await boost.importBoostJobFromTxid('6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e')

        expect(result)

    })

})
