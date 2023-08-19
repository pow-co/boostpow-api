
import models from './models'

import  * as http from 'superagent'

const snarkdown = require('snarkdown')

import { fetch } from 'powco'

import { parse } from '../includes/easy-b'

//import { postDetailQuery } from './twetch'

import { Orm, create, findOne } from './orm'

import { log } from './log'

const { TransformTx, bobFromRawTx }  = require('bmapjs')

import { publish } from 'rabbi'

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
import axios from 'axios'

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

      const app = output.s3

      if (!app) { return }

      const type = output.s4

      if (!type) { return }

      const s5 = output.s5 || output.ls5

      if (!isJSON(s5)) {

        return
      }

      var content = JSON.parse(s5)

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

    const s2 = output.s2.trim()

    if (s2 === 'B' || s2 === '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut') { // B Protocol Prefix

      var content = output.s3 || output.ls3

      const type = output.s4

      const encoding = output.s5;

      if (!type) { return }

      var result, content_base64;

      const bFileResult = parse(txhex)

      if (type.match('image')) {
          
        const data = bFileResult.buff.toString('base64')

        result = {
          type: 'B',
          content: data,
          data,
          txo: output,
          media_type: type,
          encoding: 'base64'
        }

      } else {

        result = {
          type: 'B',
          content,
          txo: output,
          media_type: type,
          encoding: 'utf8'
        }
  
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

      return result

    }

  })
  .filter(output => !!output)

}

export async function cacheContent(txid: string): Promise<[Content, boolean]> {

  log.info('content.cacheContent', { txid })

  var isNew = false;

  var content: Content = await findOne<Content>(Content,{
    where: { txid }
  })

  let hex: string;

  let bmap: any;
  if (!content) {

    hex = await fetch(txid)

    bmap = await parseBMAPTransaction(hex)

    const [bFile] = await parseBOutputs(hex)

    if (bFile) {

      content = await create<Content>(Content, {
        txid,
        content_type: bFile.media_type,
        content_text: bFile.content,
      })

    }

    const [event] = await parseEventOutputs(hex)

    if (event) {

      const { app, type, content: content_json } = event

      content = await create<Content>(Content, {
        txid,
        content_json: content_json,
        content_type: 'application/json',
        map: {
          app,
          type
        }
      })

    }

  }

  if (!content) {

    try {

        const { data } = await axios.get(`https://pow.co/api/v1/meetings/${txid}`)

        const { meeting } = data

        if (meeting) {

          content = await create<Content>(Content, {
      
            txid,
      
            content_type: 'text/calendar',
      
            content_json:  meeting
      
          })
        }

    } catch(error) {

      console.error(error)

    }
  }

  if (!content) {

    var isNew = true

    var content_type,
      content_json,
      content_text,
      content_bytes

    try {

      let resp = await http.head(`https://bitcoinfileserver.com/${txid}`)

      content_type = resp.headers['content-type']

    } catch(error) {

        log.error('content.cacheContent.error', error.response.error)

    }

    try {

      if (content_type.match('text/markdown')) {

        let { text } = await http.get(`https://bitcoinfileserver.com/${txid}`)

        content_text = text

        content_bytes = Buffer.from(text) 

      }

    } catch(error) {

        log.error('content.cacheContent.error', error)

    }

    content = await create<Content>(Content, {
      
      txid,

      content_type,

      content_json,

      content_text,

      content_bytes

    })

  }

  if (bmap && !content.get('bmap')) {

    await content.set('bmap', bmap)

  }

  /*
   * Index Bitcoin Schema "Replies"
  */
  if (!content.get('context_txid') && bmap && bmap.MAP && bmap.MAP[0].context === 'tx'  && bmap.MAP[0].tx != 'null') {

    let originalPost = await models.Content.findOne({
      where: {
        txid: bmap.MAP[0].tx
      }
    })

    if (originalPost) {

      if (!content.get('context_txid')) {

        await content.set('context_txid', bmap.MAP[0].tx)

        console.log(content.toJSON(), 'reply.imported')

      }

    }
  }

  /*
  MAP: [
    {
      cmd: 'SET',
      app: 'chat.pow.co',
      type: 'message',
      paymail: 'owenkellogg@relayx.io',
      context: 'channel',
      channel: 'powco-development'
    }
  ]
  */
  if (!content.get('bitchat_channel') && bmap && bmap.MAP && bmap.MAP[0].context === 'channel' && bmap.MAP[0].type === 'message') {

    const channel = bmap.MAP[0].channel

    const paymail = bmap.MAP[0].paymail

    await content.set('bitchat_channel', channel)

    publish('powco', `chat.channels.${channel}.message`, content.toJSON())

    publish('powco', `chat.message`, content.toJSON())

    if (paymail) {

      publish('powco', `players.${paymail}.chat.message.published`, content.toJSON())
      
    } 

    const [chatChannel] = await models.ChatChannel.findOrCreate({
      where: { channel }
    })
    chatChannel.last_message_bmap = bmap
    chatChannel.last_message_timestamp = content.get('createdAt')
    chatChannel.save()

  }
    
  return [content, isNew];

}

async function parseBMAPTransaction(hex: string): Promise<any | undefined> {

  try {

    const bob = await bobFromRawTx(hex)

    let transformed = await TransformTx(bob)

    return transformed

  } catch(error) {

    return;

  }

}

