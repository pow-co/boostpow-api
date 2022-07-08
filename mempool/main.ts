
const host = '52.206.31.171'
const port = 9333

import { Socket } from 'net'

var client = new Socket()

client.connect(port, host, function() {
  console.log('CONNECTED TO: ' + host + ':' + port);
});

console.log('socket.connect', { port, host })

client.on('connect', function(data) {
  console.log('socket.connected', data)
});

client.on('data', function(data) {
  console.log('socket.data', data)
});

client.on('close', function() {
  console.log('socket.closed');
});

client.on('end', function() {
  console.log('socket.ended');
});

client.on('error', function(error) {
  console.error('socket.error', error);
});
