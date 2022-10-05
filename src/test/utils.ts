
import * as assert from 'assert'

export { assert }

import * as chai from 'chai'

const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const expect = chai.expect

export { expect } 

var server;

import { buildServer } from '../server'

before(async () => {

    server = await buildServer()

})

export { server }

