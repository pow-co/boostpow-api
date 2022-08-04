
import { Socket } from 'socket.io'

import { sockets } from './sockets'

export async function subscribe(socket: any) {

  console.log('SUBSCRIBE SOCKET', socket)

  sockets[socket.sessionId] = socket

}

export async function unsubscribe(socket: any) {

  console.log('UNSUBSCRIBE SOCKET', socket)

  delete sockets[socket.sessionId]

}

export async function broadcast(event: string, payload: any) {

  console.log('BROADCAST', { event, payload })

  console.log(sockets)


  Object.values(sockets).forEach(socket => {

    socket.emit(event, payload)

    //socket.send(payload)

  })

}
