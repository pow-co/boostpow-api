
const { Socket } = require('phoenix-channels')

import { log } from './log'

var socket, channel;

async function connectChannel() {

  const WEBSOCKET_SERVER_URL = process.env.WEBSOCKET_SERVER_URL || "ws://54.174.184.168:4455/worker/socket"

  socket = new Socket(WEBSOCKET_SERVER_URL)

  log.info('pool.socket.connect', WEBSOCKET_SERVER_URL)
  socket.connect()

  // Now that you are connected, you can join channels with a topic:
  channel = socket.channel("cpuworkers:jobs", {})

  channel.join()
    .receive("ok", resp => { log.info("pool.socket.connected", resp) })
    .receive("error", resp => { log.info("pool.socket.error", resp) })

  return channel

}

export { channel, connectChannel }

