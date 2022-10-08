
import { plugin } from '../../socket.io/plugin'
import { server } from '../utils'


describe("Websockets Server Plugin", () => {

  it('should register the plugin with the server', async () => {

    await plugin.register(server)

  })

})
