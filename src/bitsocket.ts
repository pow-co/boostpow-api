import { log } from "./log"

import * as art from 'ascii-art'

const EventSource = require('eventsource')

import { importer, loaded as importerReady } from './importer'
import axios from "axios"

export default async function start() {

    await importerReady()

    log.info('importer.ready')

    // Base64 encode your bitquery
    const b64 = Buffer.from(JSON.stringify({

        "v": 3, 

        "q": {

            "find": {}

        }

    })).toString("base64")
    
    // Subscribe
    const sock = new EventSource('https://txo.bitsocket.network/s/'+b64)
    
    sock.onmessage = async function(e) {
    
        const { data } = JSON.parse(e.data)
    
        for (let item of data) {
    
            try {
        
                const txid = item['tx']['h']

                console.log({txid})

                for (let input of item['in']) {

                    const txid = input.e.h

                    const index = input.e.i

                    if (importer.getJob({ txid, index })) {


                        log.info('importer.getJob.job.found', { txid, index, item })

                        try {

                            const url = `https://pow.co/api/v1/boost/proofs/${item['tx']['h']}`

                            log.info('bitsocket.boost.proof.import', { url })

                            const response = await axios.post(url)

                            log.info('bitsocket.boost.proof.import.response', { status: response.status, data: response.data })

                        } catch(error) {

                            log.error('bitsocket.boost.proof.import.error', error)

                        }

                    }
            
                    console.log(input.e)
                } 
        
            } catch(error) {
        
                log.debug('bitsocket.error', error)
            
            }
        
        }
    
    }

}

if (require.main === module) {

    start()

}
