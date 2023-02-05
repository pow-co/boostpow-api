
import models from './models'

import  * as http from 'superagent'

const snarkdown = require('snarkdown')

import { fetch } from 'powco'

//import { postDetailQuery } from './twetch'

import { Orm, create, findOne } from './orm'

import { log } from './log'

export class Content extends Orm {

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

import * as Txo from 'txo'

const isJSON = require('is-json');

import * as bsv from 'bsv-2'

interface Event {
  app: string;
  type: string;
  content: any;
  author: string;
  txid: string;
  tx_index: number;
  txo: any;
  media_type: string;
  encoding: string;
}

async function parseEventOutputs(txhex: string): Promise<Event[]> {

  const txo = await Txo.fromTx(txhex)

  return txo.out.map((output, index) => {

    const s2 = output.s2.toLowerCase().trim()

    if (s2 === 'onchain.sv' || s2 === 'onchain') {

      console.log({ output })

      const app = output.s3

      if (!app) { return }

      const type = output.s4

      if (!type) { return }

      const s5 = output.s5 || output.ls5

      if (!isJSON(s5)) {

        return
      }

      const content = JSON.parse(s5)

      const result = {
        app,
        type,
        content,
        txo: output,
        media_type: 'application/json',
        encoding: 'utf8'
      }

      if (output.s6 === '|' &&
        (output.s7 === '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva' || output.s7 === 'AIP') &&
        output.s8 === 'BITCOIN_ECDSA')
      {

        const message = Buffer.from(s5, 'utf8')

        const identity = output.s9
        const signature = output.s10

        if (identity && signature) {
            
            const address = new bsv.Address().fromString(identity)
  
            const verified = bsv.Bsm.verify(message, signature, address)
  
            if (verified) {
  
              result['author'] = identity
  
              result['signature'] = signature
  
            }
  
        }

      }

      result['tx_index'] = index
      result['txid'] = txo['tx']['h']

      return result

    }

  })
  .filter(output => !!output)

}

interface BFile {
  txid: string;
  vout: number;
  data: Buffer;
  content: string;
  media_type: string;
  encoding?: string;
  filename?: string;
}

async function parseBOutputs(txhex: string): Promise<BFile[]> {

  const txo = await Txo.fromTx(txhex)

  return txo.out.map((output, index) => {

    console.log('OUPUT', output)

    const s2 = output.s2.trim()

    if (s2 === 'B' || s2 === '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut') { // B Protocol Prefix

      console.log('B FOUND', { output })

      const content = output.s3 || output.ls3


      const type = output.s4

      if (!type) { return }

      const result = {
        type: 'B',
        content,
        txo: output,
        media_type: type,
        encoding: 'utf8'
      }

      if (output.s7 === '1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5' && output.s8 === 'SET' && output.s9 === 'app' && output.s10) {

        result['app'] = output.s10

      }

      /*if (output.s13 === '|' &&
        (output.s14 === '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva' || output.s14 === 'AIP') &&
        output.s15 === 'BITCOIN_ECDSA')
      {

        const message = Buffer.from(s7, 'utf8')

        const identity = output.s16
        const signature = output.s17

        if (identity && signature) {
            
            const address = new bsv.Address().fromString(identity)
  
            const verified = bsv.Bsm.verify(message, signature, address)
  
            if (verified) {
  
              result['author'] = identity
  
              result['signature'] = signature
  
            }
  
        }

      }*/

      result['tx_index'] = index
      result['txid'] = txo['tx']['h']

      console.log('RESULT---', result)

      return result

    }

  })
  .filter(output => !!output)

}

export async function cacheContent(txid: string): Promise<[Content, boolean]> {

  log.info('content.cacheContent', { txid })

  var isNew = false;

  let content = await findOne<Content>(Content,{
    where: { txid }
  })

  if (!content) {

    const hex = await fetch(txid)

    console.log('content.hex', hex)

    const [bFile] = await parseBOutputs(hex)

    if (bFile) {

      const {content } = bFile

      console.log('create event content', {
        txid,
        content_type: bFile.media_type,
        content_text: bFile.content,
        map: {
          //app,
          //type
        }
      })

      let record = await create<Content>(Content, {
        txid,
        content_type: bFile.media_type,
        content_text: bFile.content,
        map: {
          //app,
          //type
        }
      })

      return [record, true]
    }

    const [event] = await parseEventOutputs(hex)

    if (event) {

      const { app, type, content } = event

      console.log('create event content', {
        txid,
        content_json: content,
        content_type: 'application/json',
        map: {
          app,
          type
        }
      })

      let record = await create<Content>(Content, {
        txid,
        content_json: content,
        content_type: 'application/json',
        map: {
          app,
          type
        }
      })

      return [record, true]
    }


    // get the raw transaction details and parse any known content
  }
  /*

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

  }*/

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

        content_text = text

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
