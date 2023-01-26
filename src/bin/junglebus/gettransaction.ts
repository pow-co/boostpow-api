
const txid = process.argv[2]

import { fetch } from '../../junglebus'

export async function main() {

  const hex = await fetch(txid)

  console.log('hex', { hex })

}

main()
