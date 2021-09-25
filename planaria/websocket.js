
const { Socket } = require('phoenix-channels')

let socket = new Socket("ws://pow.co/worker/socket")

try {

  socket.connect()

  // Now that you are connected, you can join channels with a topic:
  let channel = socket.channel("cpuworkers:jobs", {})
  channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.log("Unable to join", resp) })
} catch(error) {
  console.error(error)
}
