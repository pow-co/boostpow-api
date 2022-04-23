
import { server } from '../../src/hapi'

import { expect } from '../utils'

describe("API Server Posting Transactions", () => {

  describe("POST /api/v1/boost/scripts", () => {

    it("should generate a boost job script", async () => {

      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/boost/scripts',
        payload: {
          content:
              "00000000000000000000000000000000000000000068656c6c6f20776f726c64",
          diff: 157416.40184364,
          category: "00000132",
          tag: "00000000000000000000000000616e696d616c73",
          additionalData:
              "000000000000000000000000006164646974696f6e616c446174612068657265",
          userNonce: "913914e3"
        }
      })

      const script = '08626f6f7374706f7775040000013220646c726f77206f6c6c656800000000000000000000000000000000000000000004b3936a1a1400000000000000000000000000616e696d616c7304913914e320000000000000000000000000006164646974696f6e616c4461746120686572657e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac'

      expect(response.statusCode).to.be.equal(201)

      console.log(response.result)

      expect(response.result.script.hex).to.be.equal(script)

    })
  })

  describe("POST /api/v1/boost/jobs", () => {

    it("should accept a valid boost job transaction and index it")

    it("should reject an invalid boost job")

    it("should reject an invalid transaction")

  })

  describe("POST /api/v1/boost/work", () => {

    it("should accept a valid transaction that spends a job")

    it("should reject an invalid transaction")

  })

  describe("GET /api/v1/boost/jobs/{txid}", () => {

    it("should return the raw job script")

    it("should a boost job structure represented in json")

  })

})

