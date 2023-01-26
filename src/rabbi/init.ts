
require('dotenv').config()

import { getChannel } from 'rabbi'

export default async function main() {

    const channel = await getChannel()

    await channel.assertExchange('rabbi', 'direct', { durable: true })    

}

if (require.main === module) {

    main()

}