import { expect, server } from '../utils'

import { run } from '../../run'

describe("API - Posts", () => {

    it('POST /api/v1/posts should import posts', async () => {
        expect(
            server.inject({
                url: 'api/v1/posts',
                method: 'POST',
                payload: {

                }
            })
        )
        .to.be.eventually.rejected
    })

    it('POST api/v1/posts should import a post txhex', async () => {

        const txid = 'c4053a1bf2a4f0599646dfb8c29d3708487a1787ccb36ae4743c4733fc2fc988'

        const hex = await run.blockchain.fetch(txid)

        const response = await server.inject({
            url: '/api/v1/posts',
            method: 'POST',
            payload: {
                transactions: [{
                    tx: hex
                }]
            }
        })

        expect(response.statusCode).to.be.equal(200)
    })
})