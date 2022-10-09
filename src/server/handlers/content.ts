
import { cacheContent } from '../../content'

export async function show(req) {

    const [content] = await cacheContent(req.params.txid)

    return { content: content.toJSON() }

}
