#!/usr/bin/env ts-node

require('dotenv').config()

import { cacheContent } from '../content'

export async function main() {

    const txid = process.argv[2]

    try {

        const result = await cacheContent(txid)
        
        console.log('success', result)

    } catch(error) {

        console.error(error)

    }

}

main()
