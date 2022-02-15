
import * as models from '../models'

import * as http from 'superagent'

const snarkdown = require('snarkdown')

import pg from './database'

import { FetchPostDetail } from './twetch' 

export async function cacheContent(txid: string): Promise<any> {

  console.log('cache content', txid)

  let record = await models.Content.findOne({
    where: { txid }
  })

  if (record && !record.content_type) {

    try {

      let resp = await http.head(`https://media.bitcoinfiles.org/${txid}`)

      content_type = resp.headers['content-type']

      record.content_type = content_type

      await record.save()

    } catch(error) {

      console.log('error', error.response.error)

    }

  }

  if (!record) {
    console.log('record not found', txid)

    var content_type,
      content_json,
      content_text,
      content_bytes

    try {

      let resp = await http.head(`https://media.bitcoinfiles.org/${txid}`)

      content_type = resp.headers['content-type']

    } catch(error) {

      console.log('error', error.response.error)

    }

    try {

      if (!content_type) {

        let twetch = await FetchPostDetail(txid)

        if (twetch) {

          content_type = 'twetch'

          content_json = twetch

        }

      }

      if (content_type === 'text/markdown; charset=utf-8') {

        let { text } = await http.get(`https://media.bitcoinfiles.org/${txid}`)

        content_text = snarkdown(text)

        content_bytes = Buffer.from(text) 

      }


    } catch(error) {

      console.error(error)

    }
    
    record = await models.Content.create({
      
      txid,

      content_type,

      content_json,

      content_text,

      content_bytes

    })

  }

  //let {rows: job_rows} = await pg.raw(`select content, sum(value) as locked_value, sum(difficulty) as work_ordered from "boost_jobs" where content = '${txid}' group by content`)

  //record.locked_value = job_rows[0].locked_value
  //record.work_ordered = job_rows[0].work_ordered

  //let {rows: work_rows} = await pg.raw(`select content, sum(value) as unlocked_value, sum(difficulty) as work_performed from "boost_job_proofs" where content = '${txid}' group by content`)

  /*if (work_rows[0]) {

    record.unlocked_value = work_rows[0].unlocked_value
    record.work_performed = work_rows[0].work_performed

  } else {

    record.unlocked_value = 0
    record.work_performed = 0

  }
  */

  //await record.save()

  return record;

}
