
import { expect, server, moment } from '../utils'

describe("Boost Rankings API", () => {

    describe('Ranking Content', () => {

        it("GET '/api/v1/boost/rankings rank content by difficulty", async () => {

            const response = await server.inject({
                method: 'GET',
                url: '/api/v1/boost/rankings'
            })

            expect(response.statusCode).to.equal(200)

            expect(response.result.rankings).to.be.an('array')
            
        })

        it("GET '/api/v1/boost/rankings should allow a tag", async () => {

            const response = await server.inject({
                method: 'GET',
                url: '/api/v1/boost/rankings?tag=baes'
            })

            expect(response.statusCode).to.equal(200)

            expect(response.result.rankings).to.be.an('array')
            
        })

        it("GET '/api/v1/boost/rankings should allow a start and end date to be specified", async () => {

            const start_date = moment().subtract(1, 'year').unix()

            const end_date = moment().subtract(1, 'day').unix()

            const response = await server.inject({
                method: 'GET',
                url: `/api/v1/boost/rankings?start_date${start_date}&end_date=${end_date}`
            })

            expect(response.statusCode).to.equal(200)

            expect(response.result.rankings).to.be.an('array')
            
        })

    })

    describe('Ranking Tags', () => {

        it("GET '/api/v1/boost/rankings/tags rank content by difficulty", async () => {

            const response = await server.inject({
                method: 'GET',
                url: '/api/v1/boost/rankings/tags'
            })

            expect(response.statusCode).to.equal(200)

            expect(response.result.rankings).to.be.an('array')
            
        })

        it("GET '/api/v1/boost/rankings/tags should allow a start and end date to be specified", async () => {

            const start_date = moment().subtract(1, 'year').unix()

            const end_date = moment().subtract(1, 'day').unix()

            const response = await server.inject({
                method: 'GET',
                url: `/api/v1/boost/rankings/tags?start_date=${start_date}&end_date=${end_date}`
            })

            expect(response.statusCode).to.equal(200)

            expect(response.result.rankings).to.be.an('array')
            
        })

    })

})