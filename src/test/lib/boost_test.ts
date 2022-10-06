
import * as boost from '../../boost'

describe("Boost Utilities", () => {

    it('#getBoostJobsFromTxHex should return jobs from a txhex', async () => {

        const result = await boost.getBoostJobsFromTxHex()

    })

    it('#getBoostJobsFromTxid should return jobs given a txid', async () => {

        const result = await boost.getBoostJobsFromTxid()


    })

    it('#getBoostProof should return a proof given a txid', async () => {

        const result = await boost.getBoostProof()

    })

    it('#persistBoostJob should take a BoostPowJob and return a database record object', async () => {

        const result = await boost.persistBoostJob()

    })

    it('#getBoostJob should get a boost job given a txid', async () => {

        const result = await boost.getBoostJob()

    })

    it('#importBoostProofByTxid should return a proof given a txid', async () => {

        const result = await boost.importBoostProofByTxid()

    })

    it('#importBoostProofFromTxHex should call importBoostProof to import', async () => {

        const result = await boost.importBoostProofFromTxHex()

    })

    it("#importBoostProof should import a proof transaction by hex", async () => {

        const result = await boost.importBoostProof()

    })

    it('#importBoostJobFromTxid should import job from txid', async () => {

        const result = await boost.importBoostJobFromTxid()

    })

})
