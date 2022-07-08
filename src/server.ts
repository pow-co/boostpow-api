
interface BoostSearchParams {
  contentutf8?: string;
  content?: string;
  contenthex?: string;
  taghex?: string;
  tagutf8?: string;
  tag?: string;
  categoryutf8?: string;
  category?: string;
  categoryhex?: string;
  usernoncehex?: string;
  additionaldata?: string;
  additionaldatautf8?: string;
  additionaldatahex?: string;
  createdTimeFrom?: number;
  createdTimeEnd?: number;
  mindedTimeFrom?: number;
  mindedTimeEnd?: number;
  unmined?: boolean;
  txid?: string;
  spentTxid?: string;
  boostPowString?: string;
  boostHash?: string;
  boostJobId?: string;
  boostJobProofId?: string;
  limit?: number;
  bigEndian?: boolean;
  debug?: boolean;
  expanded?: boolean;
}

import { Server } from '@hapi/hapi'

import { log } from './log'

const Joi = require('joi')

import * as schema from './server/schema'

import { join } from 'path'

var register = require('prom-client').register;

const Inert = require('@hapi/inert');

const Vision = require('@hapi/vision');

const HapiSwagger = require('hapi-swagger');

const Pack = require('../package');

import { load } from './server/handlers'

import { register as prometheus } from './metrics'

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

server.route({
  method: 'GET',
  path: '/metrics',
  handler: async (req, h) => {
    return h.response(await prometheus.metrics())
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/boost/jobs',
  handler: handlers.BoostJobs.create,
  options: {
    description: 'Submit Bitcoin Transactions Containing Boost Jobs To Index',
    notes: 'Receives boost job transactions in hex form and indexes them if they are valid bitcoin transactions',
    tags: ['api', 'jobs'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        job: schema.Job
      })
    },
    validate: {
      payload: Joi.object({
        transaction: Joi.string().required()
      })
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/boost/scripts',
  handler: handlers.Scripts.create,
  options: {
    description: 'Build Boost Job Bitcoin Script ASM from JSON',
    notes: 'Provide a Boost Job data structure and receive a boost job script in response. Useful for clients that do not want to include a boostpow sdk',
    tags: ['api', 'scripts'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        script: Joi.object({
          hex: Joi.string().required()
        }).label('BoostJobScript').required()
      })
    },
    validate: {
      payload: Joi.object({
        content: Joi.string().required(),
        diff: Joi.number().required(),
        category: Joi.string().optional(),
        tag: Joi.string().optional(),
        additionalData: Joi.string().optional(),
        userNonce: Joi.string().optional()
      })
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/boost/work',
  handler: handlers.BoostWork.create,
  options: {
    description: 'Submit Bitcoin Transactions Containing Proof of Work for a Job',
    notes: 'When work is completed submit it here to be indexed. Accepts valid transactions which spend the work. The transaction may or may not be already broadcast to the Bitcoin network',
    tags: ['api', 'work'],
    response: {
      failAction: 'log'
    },
    validate: {
      payload: Joi.object({
        transaction: Joi.string().required()
      })
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/boost/jobs',
  handler: handlers.BoostJobs.index,
  options: {
    description: 'List Available Jobs',
    notes: 'For miners looking to mine new jobs, list available jobs filtered by content, difficulty, reward, tag and category',
    tags: ['api', 'jobs'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        jobs: Joi.array().items(Joi.object({
          id: Joi.number(),
          content: Joi.string().required(),
          difficulty: Joi.number().required(),
          category: Joi.string().required(),
          tag: Joi.string().required(),
          additionalData: Joi.string().required(),
          userNonce: Joi.string().required(),
          vout: Joi.number().required(),
          value: Joi.number().required(),
          timestamp: Joi.date().required(),
          spent: Joi.boolean().required(),
          script: Joi.string().required(),
          spent_txid: Joi.string().optional(),
          spent_vout: Joi.number().optional(),
          createdAt: Joi.date().optional(),
          updatedAt: Joi.date().optional()
        }))
      })
    },
    validate: {
      query: Joi.object({
        limit: Joi.number().optional(),
        tag: Joi.string().optional()
      })
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/boost/work',
  handler: handlers.BoostWork.index,
  options: {
    description: 'List Completed Work',
    notes: 'List recently performed work (completed jobs) filtered by content, difficulty, reward, tag and category',
    tags: ['api', 'work'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        jobs: Joi.array().items(schema.Job)
      })
    },
    validate: {
      query: Joi.object({
        limit: Joi.number().optional(),
        tag: Joi.string().optional()
      })
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/boost/jobs/{txid}',
  handler: handlers.BoostJobs.show,
  options: {
    description: 'Get Job From Txid',
    notes: 'Get information about a job from a transaction id. Optionally postfix with _v0, _v1, etc to specify the output containing the job',
    tags: ['api', 'jobs'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        job: Joi.object({
          id: Joi.number().required()
        }).required()
      }).required()
    },
    validate: {
      params: Joi.object({
        txid: Joi.string().required()
      }).required()
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/boost/jobs/{txid}',
  handler: handlers.BoostJobs.createByTxid,
  options: {
    description: 'Import Existing Job Transaction By Txid',
    notes: 'For any job that has not already been indexed by the system but has already been broadcast through the peer to peer network',
    tags: ['api', 'jobs'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        job: Joi.object({
          id: Joi.number().required()
        }).required()
      }).required()
    },
    validate: {
      params: Joi.object({
        txid: Joi.string().required()
      }).required()
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/boost/rankings',
  handler: handlers.Rankings.index,
  options: {
    description: 'Rank Content By Proof of Work Boosted',
    notes: 'In a given time period, return the total sum of all boost work for every piece of content. May be filtered by tag',
    tags: ['api', 'rankings'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        rankings: Joi.array().items({
          content: Joi.string().required(),
          value: Joi.number().required(),
          difficulty: Joi.number().required(),
          rank: Joi.number().required(),
          content_type: Joi.string().optional()
        }).required().label('Ranking')
      }).required().label('Rankings')
    },
    validate: {
      query: Joi.object({
        from_timestamp: Joi.number().optional(),
        tag: Joi.string().optional(),
        content: Joi.string().optional()
      }).required()
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
    tags: ['beta', 'content'],
    response: {
      failAction: 'log'
    },
    validate: {
      params: Joi.object({
        txid: Joi.string().required()
      })
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/tx/{txid}',
  handler: handlers.Transactions.show,
  options: {
    description: 'Get Bitcoin Transaction by Txid',
    notes: 'Returns the transaction in hex, json, and includes a merkleproof',
    tags: ['experimental', 'transactions'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        txhex: Joi.string().required(),
        txjson: Joi.object().required(),
        merkleproof: Joi.object().required()
      })
    },
    validate: {
      params: Joi.object({
        txid: Joi.string().required()
      })
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/utxo/{address}',
  handler: handlers.UnspentOutputs.index,
  options: {
    description: 'List Unspent Outputs For Address',
    notes: 'PREMIUM ENDPOINT! Only available to paying clients',
    tags: ['experimental', 'utxos'],
    response: {
      failAction: 'log'
    },
    validate: {
      params: Joi.object({
        address: Joi.string().required()
      })
    }
  }
})

server.route({
  method: 'POST',
  path: '/mapi/tx',
  handler: handlers.MapiTransactions.create,
  options: {
    description: 'Submit a raw transaction directly to powco nodes',
    tags: ['api', 'mapi', 'transactions'],
    response: {
      failAction: 'log'
    },
    validate: {
      payload: Joi.object({
        rawtx: Joi.string().required()
      })
    }
  }
})

const swaggerOptions = {
  info: {
    title: 'Powco API Docs',
    version: Pack.version,
    description: 'Proof of Work Service Powered by Boost POW'
  },
  schemes: ['https'],
  host: 'pow.co',
  documentationPath: '/docs',
  grouping: 'tags'
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
