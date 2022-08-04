
import { Socket } from 'socket.io'

import { log } from '../log'

type Token = string;

async function authorizeAccount(token: Token) {

}

interface AuthorizedSocket {
  socket: Socket;
  token?: Token;
}

export async function authenticate(socket: Socket): Promise<AuthorizedSocket> {

  try {

    const { address } = socket.handshake

    log.info('socket.io.authenticate', { address })

    /*const token = socket.handshake.headers['authorization'].split(' ')[1]

    log.info('socket.io.authorization.bearer', {token})

    let account = await authorizeAccount(token)

    log.info('socket.io.authenticated', { account })

    return { socket, token }
    */
   return { socket }

  } catch(error) {

    socket.emit('authentication.error', { error: error.message })

    log.error('socket.io.authentication.error', error)

    return { socket }

  }

}

