
import { expect, server } from '../utils'

describe("Boost Proofs API", () => {

    describe("Importing Boost Proofs", () => {

        it("POST '/api/v1/boost/proofs should return the proof record from a tx hex", async () => {

            const proof_tx_hex = "0200000001e1fde36ac18ce289dd8ed07c90424690f75fd59772cc9ae9305a891ab08895d10000000098483045022100b8a9cae7d3346c7aca4344d4fc0cd17ee93e1ed713a7d05274a4182c43c207cd02205ccc0aebbe7794ffa0959b243f7fa07c68493bfa7040ae852dc255319fd3325d412102f70cba8dfa2f23705c012c50a520ac0ac0fe61d2aec04a8c0b804f613348906e04076302000485a3d062086dbfa8a17b639b16040fc53a2214e8ee1688b47895f0e485ea0167c4eada12f6c579ffffffff019a260000000000001976a914e8ee1688b47895f0e485ea0167c4eada12f6c57988ac00000000"

            const response = await server.inject({
                method: 'POST',
                url: '/api/v1/boost/proofs',
                payload: {
                    transaction: proof_tx_hex
                }
            })

            expect(response.statusCode).to.equal(200)

            expect(response.result.work.tx_hex).to.equal(proof_tx_hex)
            
        })

        it("POST '/api/v1/boost/proofs/txid should return the proof record from a txid", async () => {

            const txid = "1086dd56c7fbadf272f2aec4cbe54129a8af7535835df0d0a68d2a22ac7ef7c5"

            const response = await server.inject({
                method: 'POST',
                url: `/api/v1/boost/proofs/${txid}`
            })

            expect(response.statusCode).to.equal(200)
            
        })

        it("GET '/api/v1/boost/proofs should list all proofs", async () => {

            const response = await server.inject({
                method: 'GET',
                url: `/api/v1/boost/proofs`
            })

            expect(response.statusCode).to.equal(200)
            
        })

        it("GET '/api/v1/boost/proofs should allow to filter proofs by tag", async () => {

            const response = await server.inject({
                method: 'GET',
                url: `/api/v1/boost/proofs?tag=askbitcoin.ai`
            })

            expect(response.statusCode).to.equal(200)
            
        })
    })
})