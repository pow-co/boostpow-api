
const EventSource = require('eventsource')

import { EventEmitter } from 'events'

var btoa = require('btoa');

import { CrawlerParams } from './bitbus_crawler'

const query = {
  q: {
    //find: { "out.s2": "relayx.io", "blk.i": { "$gt": 100000 } },
    find: {},
    //sort: { "blk.i": 1 },
    //project: { "blk": 1, "tx.h": 1, "out.s4": 1, "out.o1": 1 }
  },
  //lastEventId: "5ee2b2bce8404fe732a6a4f5"
};

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

export class BitSocket extends EventEmitter {

  query: string;

  onTransaction: Function;

  constructor(params: CrawlerParams) {
    super()
    this.query = params.query
    this.onTransaction = params.onTransaction
  }
  
  open() {

    const b64 = btoa(JSON.stringify({ q: this.query }))

    var url = "https://txo.bitsocket.network/s/" + b64;

    var socket = new EventSource(url);

    socket.onmessage = (e) => {

      const { data } = JSON.parse(e.data)

      for (let transaction of data) {

        this.onTransaction(transaction)

      }

      //console.log(e.data)

    }

  }

}

