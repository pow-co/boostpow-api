
const EventSource = require('eventsource')

var btoa = require('btoa');

const query = {
  q: {
    //find: { "out.s2": "relayx.io", "blk.i": { "$gt": 100000 } },
    find: { "out.s0": "boostpow", "blk.i": { "$gt": 100000 } },
    sort: { "blk.i": 1 },
    //project: { "blk": 1, "tx.h": 1, "out.s4": 1, "out.o1": 1 }
  },
  lastEventId: "5ee2b2bce8404fe732a6a4f5"
};

const b64 = btoa(JSON.stringify(query))
// Subscribe
//

//let url = `https://txo.bitsocket.network/s/${b64}`
//
/*const sock = new EventSource(url, {
  headers: {
    "Last-Event-ID": "5ee2b2bce8404fe732a6a4f5",
    "lastEventId": "5ee2b2bce8404fe732a6a4f5"
  }
})
sock.onmessage = function(e) {
  console.log(sock)
  console.log(e)
}
*/


//var EventSource = require('eventsource')
/*var query = {
  "v": 3, "q": { "find": {} }
}
*/
//var b64 = Buffer.from(JSON.stringify(query)).toString("base64")
var url = "https://genesis.bitdb.network/s/1FnauZ9aUH2Bex6JzdcV4eNX7oLSSEbxtN/" + b64;
var socket = new EventSource(url);
socket.onmessage = function(e) {
  console.log(e.data)
}
