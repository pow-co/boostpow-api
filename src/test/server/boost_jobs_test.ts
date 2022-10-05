
import { expect, server } from '../utils'

describe("API - Boost Jobs", () => {

  it('POST /api/v1/boost/jobs should import a job txhex', async () => {

    expect(
      server.inject({
        url: '/api/v1/boost/jobs',
        method: 'POST',
        payload: {
  
        }
      })
    )
    .to.be.eventually.rejected

  })

  it('GET /api/v1/boost/jobs should list available jobs', async () => {

    const response = await server.inject({
      url: '/api/v1/boost/jobs',
      method: 'GET'
    })

    expect(response.statusCode).to.be.equal(200)

  })

  it('GET /api/v1/boost/jobs/{txid} should get a single job', async () => {

    const response = await server.inject({
      url: '/api/v1/boost/jobs/37c268f072b782a020efc5b3f0c4c0511c74f7b84084f08dabe6808099cb8e2a',
      method: 'GET'
    })

    expect(response.statusCode).to.be.equal(200)

  })

  it('POST /api/v1/boost/jobs/{txid} should import a job by txid', async () => {

    const response = await server.inject({
      url: '/api/v1/boost/jobs/37c268f072b782a020efc5b3f0c4c0511c74f7b84084f08dabe6808099cb8e2a',
      method: 'POST'
    })

    expect(response.statusCode).to.be.equal(200)

  })

})

