require('dotenv').config()

const socketio = require('socket.io')

import { WebSocketServer } from "ws";

import { Server } from '@hapi/hapi'

import { log } from '../log'

import { Actor } from 'rabbi'

import { EventEmitter } from "events";

export const plugin = (() => {

  const events = new EventEmitter()

  return {

    name: 'websockets',

    register: function(server: Server) {

      const port = process.env.websockets_port || 5201
      
      const wsServer = new WebSocketServer({ port });

      log.info('websockets.server.started', { port })

      wsServer.on("connection", (socket) => {

        function sendBoostpowJobCreatedMessage(content) {
          socket.send(JSON.stringify({ type: 'boostpow.job.created', content }))
        }

        function sendBoostpowProofCreatedMessage(content) {
          socket.send(JSON.stringify({ type: 'boostpow.job.created', content }))
        }

        events.on('boostpow.job.created', sendBoostpowJobCreatedMessage)
        events.on('boostpow.proof.created', sendBoostpowProofCreatedMessage)

        log.info('websocket.connection', { socket })

        socket.on('close', () => {            
            log.info('websocket.close', { socket })

            events.removeListener('boostpow.job.created', sendBoostpowJobCreatedMessage)
            events.removeListener('boostpow.proof.created', sendBoostpowProofCreatedMessage)            
        })


        socket.on('error', () => {            
            log.info('websocket.error', { socket })
        })
      
        // receive a message from the client
        wsServer.on("message", (data) => {

          log.info('websocket.message.received', {data})

          const packet = JSON.parse(data);

          switch (packet.type) {
            case "hello from client":
              // ...
              break;
          }
        });

      });
  

      Actor.create({

        exchange: 'powco',

        routingkey: 'askbitcoin.question.created',

        queue: 'askbitcoin_created_broadcast_websockets',

      })
      .start(async (channel, msg, json) => {

        events.emit('askbitcoin.question.created', json)

      });

      Actor.create({

        exchange: 'powco',

        routingkey: 'boostpow.job.created',

        queue: 'boostpow_job_created_broadcast_websockets',

      })
      .start(async (channel, msg, json) => {

        console.log('boostpow.job.created', json)

        events.emit('boostpow.job.created', json)

      });

      Actor.create({

        exchange: 'powco',

        routingkey: 'boostpow.proof.created',

        queue: 'boostpow_proof_created_broadcast_websockets',

      })
      .start(async (channel, msg, json) => {

        console.log('boostpow.proof.created', json)

        events.emit('boostpow.proof.created', json)

      });

    }

  }

})()


