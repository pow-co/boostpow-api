
import { cacheContent } from '../../content'

import { badRequest } from 'boom'

import { log } from '../../log'

export async function show(req) {

    try {

        const [content] = await cacheContent(req.params.txid)

        return { content: content.toJSON() }
        
    } catch(error) {

        log.error('api.handlers.content.show.error', error)

        return badRequest(error.message)

    }

}
