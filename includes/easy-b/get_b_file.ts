
const { read } = require('.')

const { fetch } = require('powco')

export async function main() {

  const txid = '0c3990c9c48defd47cb75f2f3f66f34346883b80cbf4eab1f07f826c75d93c9e'

  const result = await read(txid)

  console.log(result)

  console.log(result.buff.toString('base64'))

}

main()

