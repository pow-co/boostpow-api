import { server } from './mocks/server'
import chaiAsPromised from 'chai-as-promised'
import chai from 'chai'
chai.use(chaiAsPromised)

import { before, afterEach, after } from 'mocha'

// Establish API mocking before all tests.
before(() => server.listen({
    onUnhandledRequest: 'error'
}))

server.printHandlers();
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {server.resetHandlers();})

// Clean up after the tests are finished.
after(() => server.close())