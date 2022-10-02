
import * as assert from 'assert'

export { assert }

import * as chai from 'chai'

const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const expect = chai.expect

export { expect } 

import { Wallet } from 'boostminer'

const wallet = Wallet.init()

export { wallet } 

var server;

import { buildServer } from '../src/server'

before(async () => {

    server = await buildServer()

})

export { server }

