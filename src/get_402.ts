import { Address } from 'bsv'

const Message = require('bsv/message')

import * as Ajv from 'ajv'

const ajv = new Ajv()

const signerSchema = {
  type: "object",
  properties: {
    signer: { type: "string" },
    signature: { type: "string" },
    message: { type: "string" }
  },
  required: ["foo"],
  additionalProperties: true
}

export class Get402InvalidAppId extends Error {
  name: 'Get402InvalidAppId' 
}

export interface Get402Check {
  client_id: string;
  method: string;
  payload: any;
}

export interface ValidGet402Headers {
  signer: string;
  signature: string;
  message: string;
}

export class Get402App {

  identifier: string;

  constructor(identifier) {

    try {

      new Address(identifier)

    } catch(error) {

      throw new Get402InvalidAppId()

    }

    this.identifier = identifier

  }

  validateSignatureHeaders(headers): ValidGet402Headers {

    const signer = headers['x-signer']
    const signature = headers['x-signature']
    const message = headers['x-message']

    const valid = ajv.validate(signerSchema, { signer, signature, message })

    if (!valid) {

      throw new Error('headers must include valid entries x-signer, x-signature, x-message')

    }

    let validSignature = new Message(message).verify(signer, signature);

    if (!validSignature) {

      throw new Error('signature validation failed')

    }

    return { signer, signature, message }

  }

  checkBalance(client_id: string) {

  }

  recordApiCall(check: Get402Check) {

  }


}
