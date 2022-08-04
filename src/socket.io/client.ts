
const io = require('socket.io-client')

import { Socket } from 'socket.io-client'

import { log } from '../log'

export async function connectClient(url: string): Promise<Socket> {

  let socket = io(url)

  socket.on('connect', () => {

    socket.emit('authenticate')

  })

  return socket;

}
