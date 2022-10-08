
import { expect, server } from '../utils'

describe("API - Unspent Outputs", () => {

  it("GET /api/v1/utxos/{address} should return the address's  utxos", async () => {

    const result = await server.inject({
        url: '/api/v1/utxos/1Knr86EWWLju1FrkXKEZzm2nSoqdzWVi2B',
        method: 'GET',
    })

    expect(result)

  })

})
