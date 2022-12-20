
import models from './models'

import  * as http from 'superagent'

const snarkdown = require('snarkdown')

//import { postDetailQuery } from './twetch'

import { Orm, create, findOne } from './orm'

import { log } from './log'

class Content extends Orm {

    static model = models.Content

    content_type: string;

    txid: string;

    get boostpow_jobs() {
        return this.record['boostpow_jobs']
    }

    get boostpow_proofs() {
        return this.record['boostpow_proofs']
    }

    async listBoostpowJobs(): Promise<any[]> {

        const result = await models.BoostJob.findAll({
            where: {
                content: this.txid
            }
        })

        return result

    }

    async listBoostpowProofs(): Promise<any[]> {

        const result = await models.BoostWork.findAll({
            where: {
                content: this.txid
            }
        })

        return result

    }
    
}

export async function cacheContent(txid: string): Promise<[Content, boolean]> {

  log.info('content.cacheContent', { txid })

  var isNew = false;

  let content = await findOne<Content>(Content,{
    where: { txid }
  })

  if (content && !content.content_type) {

    (async () => {

      try {

        let resp = await http.head(`https://bitcoinfileserver.com/${txid}`)

        console.log('HEADERS 1', resp.headers)

        content_type = resp.headers['content-type']

        content.content_type = content_type

        await content.save()

      } catch(error) {

        log.error('content.cacheContent.error', error.response.error)

      }

    })()

  }

  if (!content) {

    var isNew = true

    var content_type,
      content_json,
      content_text,
      content_bytes

    try {

      let resp = await http.head(`https://bitcoinfileserver.com/${txid}`)

      console.log('HEADERS 2', resp.headers)

      content_type = resp.headers['content-type']

    } catch(error) {

        log.error('content.cacheContent.error', error.response.error)

    }

    try {

      console.log('CONTENT TYPE', content_type)

      /*if (!content_type) {

        let twetch = await postDetailQuery(txid)

        if (twetch) {

          content_type = 'twetch'

          content_json = twetch

        }

      }
      */

      if (content_type.match('text/markdown')) {

        console.log('MARKDOWN')

        let { text } = await http.get(`https://bitcoinfileserver.com/${txid}`)

        content_text = snarkdown(text)

        content_bytes = Buffer.from(text) 

      }

    } catch(error) {

        log.error('content.cacheContent.error', error.response.error)

    }
    
    content = await create<Content>(Content, {
      
      txid,

      content_type,

      content_json,

      content_text,

      content_bytes

    })

  }

  return [content, isNew];

}
