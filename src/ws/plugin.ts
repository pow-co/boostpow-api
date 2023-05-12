require('dotenv').config()

const socketio = require('socket.io')

import { WebSocketServer, WebSocket } from "ws";

import { Server } from '@hapi/hapi'

import { log } from '../log'

import { Actor } from 'rabbi'

import { EventEmitter } from "events";

import { getChannel, publish } from 'rabbi'

const events = new EventEmitter()

import { v4 as uuid } from 'uuid'

function sendMessage(socket:WebSocket, type:string, content:any) {

  socket.send(JSON.stringify({ type, content }))

}

async function handleConnectionChatChannel(socket: WebSocket, request, channel: string) {

  sendMessage(socket, `websockets.chat.channels.${channel}.connected`, { success:true })

  const amqpChannel = await getChannel()

  const queue = uuid()

  amqpChannel.assertQueue(queue)

  const routingKey = `chat.channels.${channel}.message`

  amqpChannel.bindQueue(queue, 'powco', routingKey)

  amqpChannel.consume(queue, (msg) => {

    if (!msg) { return }

    sendMessage(socket, routingKey,  JSON.parse(msg.content.toString()))

    amqpChannel.ack(msg)

  })

  socket.on('close', () => {

    amqpChannel.deleteQueue(queue)

  }) 

}

async function handleConnectionChats(socket, request) {

  sendMessage(socket, 'websockets.chats.connected', { success:true })

  sendMessage(socket, 'websockets.bmap.connected', { success:true })

  const amqpChannel = await getChannel()

  const queue = uuid()

  amqpChannel.assertQueue(queue)

  amqpChannel.bindQueue(queue, 'powco', 'chat.message')

  amqpChannel.consume(queue, (msg) => {

    sendMessage(socket, 'bitchat.transaction.discovered', msg.content.toString())

    amqpChannel.ack(msg)

  })

  socket.on('close', () => {

    amqpChannel.deleteQueue(queue)

  }) 

}

async function handleConnectionPosts(socket, request) {

  sendMessage(socket, 'websockets.posts.connected', { success:true })

}

async function handleConnectionReplies(socket, request) {

  sendMessage(socket, 'websockets.replies.connected.', { success:true })

}

async function handleConnectionSuperchats(socket, request) {

  sendMessage(socket, 'websockets.superchats.connected', { success:true })

}

async function handleConnectionBMAP(socket, request) {

  sendMessage(socket, 'websockets.bmap.connected', { success:true })

  const channel = await getChannel()

  const queue = uuid()

  channel.assertQueue(queue, { autoDelete: true})

  channel.bindQueue(queue, 'powco', 'bmap.transaction.discovered')

  channel.consume(queue, (msg) => {

    sendMessage(socket, 'bmap.transaction', JSON.parse(msg.content.toString()))

    channel.ack(msg)

  })

  socket.on('close', () => {

    channel.deleteQueue(queue)

  })

}

async function handleConnectionBoost(socket, request) {

  sendMessage(socket, 'websockets.boostpow.connected', { success:true })

  function sendBoostpowJobCreatedMessage(content) {
    socket.send(JSON.stringify({ type: 'boostpow.job.created', content }))
  }

  function sendBoostpowProofCreatedMessage(content) {
    socket.send(JSON.stringify({ type: 'boostpow.proof.created', content }))
  }

  events.on('boostpow.job.created', sendBoostpowJobCreatedMessage)
  events.on('boostpow.proof.created', sendBoostpowProofCreatedMessage)

  log.info('websocket.connection', { socket })

  socket.on('close', () => {            
      log.info('websocket.close', { socket })

      events.removeListener('boostpow.job.created', sendBoostpowJobCreatedMessage)
      events.removeListener('boostpow.proof.created', sendBoostpowProofCreatedMessage)            
  })
}

export const plugin = (() => {

  return {

    name: 'websockets',

    register: function(server: Server) {

      const port = process.env.websockets_port || 5201
      
      const wsServer = new WebSocketServer({ port });

      log.info('websockets.server.started', { port })

      wsServer.on("connection", (socket, request) => {

        console.log('Websocket Connected', {uri:request.uri, url:request.url})

        socket.on('error', () => {            
            log.info('websocket.error', { socket })
        })
      
        switch(request.url) {
          case '/websockets/chat':
            handleConnectionChats(socket, request)
            return;
          case '/websockets/posts':
            handleConnectionPosts(socket, request)
            return;
          case '/websockets/replies':
            handleConnectionReplies(socket, request)
            return;
          case '/websockets/superchats':
            handleConnectionSuperchats(socket, request)
            return;
          case '/websockets/bmap':
            handleConnectionBMAP(socket, request)
            return;
          case '/websockets/boost':
            handleConnectionBoost(socket, request)
            return;
        }

        if (request.url.match('/websockets/chat/channels/')) {

          const channel = request.url.split('/').slice(-1)

          handleConnectionChatChannel(socket, request, channel)

        }

        return handleConnectionBoost(socket, request)

      });

      wsServer.on("message", (data) => {

        log.info('websocket.message.received', {data})

        const packet = JSON.parse(data);

        switch (packet.type) {
          case "hello from client":
            // ...
            break;
        }
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


