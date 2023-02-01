require('dotenv').config()

const socketio = require('socket.io')

import { Server } from '@hapi/hapi'

import { log } from '../log'

import { Actor } from 'rabbi'

import * as uuid from 'uuid'

export const plugin = (() => {

  return {

    name: 'socket.io',

    register: function(server: Server) {

      const path = '/v1/socketio'

      //const io = socketio(server.listener, { path })
      const io = socketio(server.listener)

      log.info('socket.io.started', { path })

      io.use(async (socket, next) => {

        socket.data.sessionId = uuid.v4()

        // authenticate here

        next()

      })

      io.on('connection', async function(socket) {

        const { address } = socket.handshake

        log.info('socket.io.connection', { address })

        socket.on('disconnect', () => {

          log.info('socket.io.disconnect', socket.info)

        })

      })

      Actor.create({

        exchange: 'powco',

        routingkey: 'askbitcoin.question.created',

        queue: 'askbitcoin_created_broadcast_websockets',

      })
      .start(async (channel, msg, json) => {

        io.emit('boostpow.job.created', json)

      });

      Actor.create({

        exchange: 'powco',

        routingkey: 'boostpow.job.created',

        queue: 'askbitcoin_boostpow_job_created_broadcast_websockets',

      })
      .start(async (channel, msg, json) => {

        io.emit('boostpow.job.created', json)

      });

      Actor.create({

        exchange: 'powco',

        routingkey: 'boostpow.proof.created',

        queue: 'askbitcoin_boostpow_proof_created_broadcast_websockets',

      })
      .start(async (channel, msg, json) => {

        io.emit('boostpow.proof.created', json)

      });

    }

  }

})()


