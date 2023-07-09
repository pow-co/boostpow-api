
import * as assert from 'assert'

import moment from 'moment' 

export { assert }

export { moment }

import * as chai from 'chai'

import models from '../models'

const expect = chai.expect

export { expect } 

var server;

import { buildServer } from '../server'

before(async () => {

    server = await buildServer()

    await models.Content.destroy({
        where: {},
        truncate: true
    })
})

export { server }

