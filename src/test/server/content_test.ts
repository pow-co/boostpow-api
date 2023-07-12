
import models from '../../models';
import { expect, server } from '../utils'

describe("Boost Proofs API", () => {
    after(async () => {
        await models.Content.destroy({where: {}});
        await models.Event.destroy({where: {}});
    });

    describe("Importing Boost Proofs", () => {

        it("POST '/api/v1/content should return metadata about content", async () => {

            const txid = 'f9e6c4f0ac7219257e1276cd23c1bff5e5088204ff4e3471786c6252fb00f01e'

            const { result } = await server.inject({
                method: 'GET',
                url: `/api/v1/content/${txid}`
            })

            expect(result.content.content_type).to.equal('text/markdown')
            
        })

    })
})