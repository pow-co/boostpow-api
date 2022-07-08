
import { BitSocket } from '../bitsocket' 

let socket = new BitSocket({

  query: {

    find: {

      "out.s0": "boostpow"

    }

  },

  onTransaction(tx) {

    console.log(tx)

  }

})

socket.open()

