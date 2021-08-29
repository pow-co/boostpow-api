
import { Miner } from './miner'

let miner = new Miner()

import { connectChannel} from './socket'

(async () => {

  const channel = await connectChannel()

  miner.mine({
    content: '0xB3E04FAEC739C6A337002AC4015AC9515D4184DC4C7637DE9D390EEBCDF0E0DB',
    difficulty: 0.001
  })

  miner.on('besthash', (payload) => {
    //console.log('besthash', payload)
    channel.push('besthash', payload)
  })

  miner.on('solution', (payload) => {
    console.log('solution', payload)
    channel.push('solution', payload)
  })

  miner.on('hashrate', (payload) => {
    console.log(payload)
    channel.push('hashrate', payload)
  })

})();

