
import { expect, server } from '../utils'

describe("Boost Proofs API", () => {

    describe("Importing Boost Proofs", () => {

        it("POST '/api/v1/content should return metadata about content", async () => {

            const txid = 'f9e6c4f0ac7219257e1276cd23c1bff5e5088204ff4e3471786c6252fb00f01e'

            const response = await server.inject({
                method: 'GET',
                url: `/api/v1/content`
            })

            expect(response.content.content_type).to.equal('text/markdown; binary; charset=utf-8')
            
        })

    })
})