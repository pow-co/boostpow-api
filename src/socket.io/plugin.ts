require('dotenv').config()

const socketio = require('socket.io')

import { Server } from '@hapi/hapi'

import { authenticate } from './auth'

import { log } from '../log'

import { subscribe } from './pubsub'

import { Actor } from 'rabbi'

export const plugin = (() => {

  return {

    name: 'socket.io',

    register: function(server: Server, options, next) {

      const path = '/v1/socketio'

      //const io = socketio(server.listener, { path })
      const io = socketio(server.listener)

      log.info('socket.io.started', { path })

      io.use(async (socket, next) => {

        const { address } = socket.handshake

        await authenticate(socket)

        log.info('socket.io.authenticated', { address })

        socket.emit('authenticated')

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

        routingkey: 'boostpow.job.created',

        queue: 'boostpow_job_created_broadcast_websockets',

      })
      .start(async (channel, msg, json) => {

        io.emit('boostpow.job.created', json)

        channel.ack(msg);

      });

      Actor.create({

        exchange: 'powco',

        routingkey: 'boostpow.proof.created',

        queue: 'boostpow_proof_created_broadcast_websockets',

      })
      .start(async (channel, msg, json) => {

        io.emit('boostpow.proof.created', json)

        channel.ack(msg);

      });

    }

  }

})()

if (require.main === module) {

  (async () => {

    const server = new Server({
      host: process.env.HOST || "localhost",
      port: process.env.PORT || 8001,
      routes: {
        cors: true
      }
    });

    await server.register(plugin)

    log.info('socket.io.server.start')

    await server.start();
    
    log.info('socket.io.server.started', server.info)

  })()

}

