
import { Schema } from 'joi'

import * as Joi from 'joi'

export class Handler {
  method: string;
  schema: Schema;
  handler: Function;

  constructor(params: {method:string, schema: Schema, handler: Function}) {
    this.method = params.method
    this.schema = params.schema
    this.handler = params.handler
  }
}

interface AuthToken {
  token: string;
}

const handlers = {

  authenticate: new Handler({
    method: 'authenticate',
    schema: Joi.object({
      token: Joi.string().required()
    }),
    handler: async ({ token }: AuthToken) => {

    }
  })

}

