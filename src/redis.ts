
import { createClient } from 'redis';

let client;

if (process.env.REDIS_URL) {

  client = createClient({ url: process.env.REDIS_URL,
  socket: {
      connectTimeout: 50000,
    } })

}
else {
  client = createClient({
    socket: {
      connectTimeout: 50000,
    }
  });
}

const start = async ()=> {
await client.connect()
}
start();
export default client

