
import { expect, server } from '../utils'

describe("API - Unspent Outputs", () => {

  it.skip("GET /api/v1/spends/{output_txid}/{output_index} should get return the spending txid and index for a spent output", async () => {

    const spent = {
        hash: "6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e",
        index: 2
    }

    const { result } = await server.inject({
        url: `/api/v1/spends/${spent.hash}/${spent.index}`,
        method: 'GET',
    })

    expect(result.input.hash).to.be.equal('053fa2c9851635b5080dc7906c4ee0ca637e7633f959b04f0cb6a93afe6d5a67')
    expect(result.input.index).to.be.equal(1)

    expect(result.output.hash).to.be.equal(spent.hash)
    expect(result.output.index).to.be.equal(spent.index)

})

it.skip("GET /api/v1/spends/{output_txid}/{output_index} should get return spent:false for a yet unspent output", async () => {

    const unspent = {
        hash: '07d5a9f803f8279471b64d39f07fafbf27fecd71f5f9350e1b43d2b2373352be',
        index: 3
    }

    const { result } = await server.inject({
        url: `/api/v1/spends/${unspent.hash}/${unspent.index}`,
        method: 'GET',
    })

    expect(result.input).to.be.equal(undefined)

})

})
