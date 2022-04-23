

import { Server } from '@hapi/hapi'

import { log } from './log'

//import * as Joi from '@hapi/joi'

const Joi = require('@hapi/joi')

import { join } from 'path'

const Inert = require('@hapi/inert');

const Vision = require('@hapi/vision');

const HapiSwagger = require('hapi-swagger');

const Pack = require('../package');

import { load } from './server/handlers'

const handlers = load(join(__dirname, './server/handlers'))

export const server = new Server({
  host: process.env.HOST || "0.0.0.0",
  port: process.env.PORT || 8000,
  routes: {
    cors: true,
    validate: {
      options: {
        stripUnknown: true
      }
    }
  }
});

// POST /node/api/boost_jobs
// POST /node/api/boost_job_transactions
// GET /node/api/content/:txid
//
// POST /node/api/jobs
//
// POST /api/v1/work
// POST /v1/main/boost/jobs/:txid/proof
// GET /v1/main/boost/jobs/:txid
// POST /v1/main/boost/jobs/scripts
// GET /node/v1/ranking/value
// GET /node/v1/ranking
// GET /node/v1/ranking-timeframes
// GET /node/v1/content/:content/rankings
// GET /v1/main/boost/search
// GET /v1/main/boost/id/:id

server.route({
  method: 'POST',
  path: '/api/v1/boost_job_transactions',
  handler: () => {},
  options: {
    description: 'Submit Jobs To Index',
    notes: 'Receives boost job transactions in hex form and indexes them if they are valid bitcoin transactions',
    tags: ['api'],
    response: {
      failAction: 'log'
    },
    validate: {
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/boost/scripts',
  handler: handlers.Scripts.create,
  options: {
    description: 'Get New Job Script',
    notes: 'Provide a Boost Job data structure and receive a boost job script in response. Useful for clients that do not want to include a boostpow sdk',
    tags: ['api'],
    response: {
      failAction: 'log'
    },
    validate: {
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/work',
  handler: () => {},
  options: {
    description: 'Submit New Work',
    notes: 'When work is completed submit it here to be indexed. Accepts valid transactions which spend the work. The transaction may or may not be already broadcast to the Bitcoin network',
    tags: ['api'],
    response: {
      failAction: 'log'
    },
    validate: {
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/jobs',
  handler: () => {},
  options: {
    description: 'List Available Jobs',
    notes: 'For miners looking to mine new jobs, list available jobs filtered by content, difficulty, reward, tag and category',
    tags: ['api'],
    response: {
      failAction: 'log'
    },
    validate: {
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/content/{txid}',
  handler: () => {},
  options: {
    description: 'Show Content Jobs & Work',
    notes: 'For applications looking to display work for a given piece of content, or miners looking to mine specific content. Includes jobs, work, and content metadata',
    tags: ['api'],
    response: {
      failAction: 'log'
    },
    validate: {
    }
  }
})

const swaggerOptions = {
  info: {
    title: 'Pow.co API Documentation',
    version: Pack.version,
  },
  schemes: ['https'],
  host: 'pow.co'
}

export async function start() {

  await server.register([
      Inert,
      Vision,
      {
          plugin: HapiSwagger,
          options: swaggerOptions
      }
  ]);

  await server.start();

  log.info(server.info)

}

if (require.main === module) {

  start()

}
