
import { createClient } from 'redis';

let client = createClient()

if (process.env.REDIS_URL) {

  client = createClient({ url: process.env.REDIS_URL })

}

client.connect()

export default client

