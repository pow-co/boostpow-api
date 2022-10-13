
import { expect, server } from '../utils'

import { run } from '../../run'

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

  it('POST /api/v1/boost/jobs should import a job txhex', async () => {

    const txid = '275667cfab138f1d780c0fe52fb2d1720d4cab2029aaf94b91e5752bbfa94dc9'

    const hex = await run.blockchain.fetch(txid)

    const response = await server.inject({
      url: '/api/v1/boost/jobs',
      method: 'POST',
      payload: {
        transaction: hex
      }
    })

  })

  it('GET /api/v1/boost/jobs should list available jobs', async () => {

    const response = await server.inject({
      url: '/api/v1/boost/jobs',
      method: 'GET'
    })

    expect(response.statusCode).to.be.equal(200)

  })

  it('GET /api/v1/boost/jobs should allow tag and content to be specified', async () => {

    const response = await server.inject({
      url: '/api/v1/boost/jobs?tag=askbitcoin&content=37c268f072b782a020efc5b3f0c4c0511c74f7b84084f08dabe6808099cb8e2a',
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

  it('GET /api/v1/boost/jobs/{txid} should return 404 if the job does not exist', async () => {

    const response = await server.inject({
      url: '/api/v1/boost/jobs/fad3a6f86f7a61fad5790f9bb5696500ac8b88053738007e1b4048566a15366b',
      method: 'GET'
    })

    expect(response.statusCode).to.be.equal(404)

  })

  it('POST /api/v1/boost/jobs/{txid} should import a job by txid', async () => {

    const response = await server.inject({
      url: '/api/v1/boost/jobs/37c268f072b782a020efc5b3f0c4c0511c74f7b84084f08dabe6808099cb8e2a',
      method: 'POST'
    })

    expect(response.statusCode).to.be.equal(200)

  })

})

