
import { Server } from "socket.io";

const io = new Server();

import { log } from '../../lib/logger'

io.on("connection", (socket) => {

  log.info('socket.connected', socket)

})

io.listen(8001);

