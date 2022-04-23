
import { Get402App, Get402InvalidAppId } from '../src/get_402'

import { PrivateKey } from 'bsv'

import { expect } from './utils'

describe("Get402 Paid API Calls", () => {

  it("should accept a valid bitcoin address as identifier", () => {

    let valid = new PrivateKey().toAddress().toString()

    let app = new Get402App(valid)

  })

  it("should reject an invalid bitcoin address as identifier", () => {

    let invalid = 'invalidaddress'

    expect (() => new Get402App(invalid)).to.throw()

  })

  it("should parse valid request headers for signature", () => {

    let valid = new PrivateKey().toAddress().toString()

    let app = new Get402App(valid)

    const headers = {
      'x-signer': '1NEcz9jQwdTi19qup2tKkeYjYd4HGZGb4W',
      'x-signature': 'IOHkyEIFBWrhQb1MRx3f1lT53V/bNFYgUTVOvV6u2Y9icWZb1GNdGZrI/uiHt4SV7rGAvTGTg9Dg7Xm3vwr8y+c=',
      'x-message': '{"method":"getjob","payload":{"txid":"10174a741c2a66372bf6671ab83cf11c222f13d8bc2181ff419f52af095d27d0","url":"http://localhost:4001/node/v1/boost/jobs/10174a741c2a66372bf6671ab83cf11c222f13d8bc2181ff419f52af095d27d0"},"nonce":"14300d61-a7f2-47d8-bf5f-64e737e9f799"}'
    }

    const { signer, signature, message } = app.validateSignatureHeaders(headers)

    expect(signer).to.equal(headers['x-signer'])
    expect(signature).to.equal(headers['x-signature'])
    expect(message).to.equal(headers['x-message'])

  })

  it("should reject invalid request headers for signature", () => {

    let valid = new PrivateKey().toAddress().toString()

    let app = new Get402App(valid)

    const headers = {
      'x-signer': '1NEcz9jQwdTi19qup2tKkeYjYd4HGZGb4W',
      'x-signature': 'IOHkyEIFBWrhQb1MRx3f1lT53V/bNFYgUTVOvV6u2Y9icWZb1GNdGZrI/uiHt4SV7rGAvTGTg9Dg7Xm3vwr8y+c=',
      'x-message': 'invalidmessage'
    }

    expect (() => {

      app.validateSignatureHeaders(headers)

    }).to.throw()

  })

})

