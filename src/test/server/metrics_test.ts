
import { expect, server } from '../utils'

describe("Prometheus Metrics", () => {

    it("GET '/metrics should return success", async () => {

        const response = await server.inject({
            method: 'GET',
            url: '/metrics'
        })

        expect(response.statusCode).to.equal(200)
        
    })
    
})
