
import { log } from '../../../lib/logger'

const io = require('socket.io-client')

console.log(io)

const socket = io.connect("http://localhost:3000")

socket.on('connected', console.log)

