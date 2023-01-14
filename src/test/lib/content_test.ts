
import { expect } from '../utils'

import { cacheContent } from '../../content'
import { exponentialBuckets } from 'prom-client'

describe("Caching Blockchain Content", () => {

    it("#cacheContent should fetch an image from the blockchain and record it in the database", async () => {

        const txid = '45f1ec3bab92324d9703ff165a0b9b42b38e55122c52a06037267f015844c5d4'

        const [result] = await cacheContent(txid)

        expect(result.get('content_type')).to.be.equal('image/jpeg; binary')

        expect(result.get('txid')).to.be.equal(txid)

    })

    it("#cacheContent should return the content from the database if it is already cached", async () => {

        const txid = '60fef3ed6fa4b6366f550cdf2b46f400a52f40418cdc345a14df24d862454115'

        await cacheContent(txid)

        const [result, isNew] = await cacheContent(txid)

        expect(result.get('content_type')).to.be.equal('image/jpeg; binary')

        expect(isNew).to.be.equal(false)

    })

    it('#cacheContent should cache markdown files', async () => {

        const txid = 'f9e6c4f0ac7219257e1276cd23c1bff5e5088204ff4e3471786c6252fb00f01e'

        const [content] = await cacheContent(txid)

        expect(content.get('content_type')).to.be.equal('text/markdown; binary; charset=utf-8')

    });

    it('#cacheContent should cache a URL linked on chain', async () => {

        const txid = '3cd2d6b4108abbd34283f9a76471a992836bf71ea5397fa5529a0fbe3991ee32'

        const [content] = await cacheContent(txid)

        expect(content.get('content_type')).to.be.equal('application/json')

        expect(content.get('map')['app']).to.be.equal('pow.co')

        expect(content.get('map')['type']).to.be.equal('url')

        expect(content.get('content_json')['url']).to.be.equal('https://bitchatnitro.com/channels/powco-development')

    });

    it.skip('#cacheContent should cache a RUN OrderLock transaction', async () => {


    })

    it('content has many boostpow proofs', async () => {

        const txid = '60fef3ed6fa4b6366f550cdf2b46f400a52f40418cdc345a14df24d862454115'

        const [content] = await cacheContent(txid)
        /*

        const jobs = await content.listBoostpowJobs()

        const proofs = await content.listBoostpowProofs()

        expect(jobs).to.be.an('array')

        expect(proofs).to.be.an('array')
        */
        
    })

})
