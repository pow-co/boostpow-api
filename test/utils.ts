
import * as assert from 'assert'

import * as chai from 'chai'

const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const expect = chai.expect

export {
  assert,
  expect
}
