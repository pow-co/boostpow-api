
import * as models from '../models'

import * as http from 'superagent'

import pg from './database'

export async function cacheContent(txid: string): Promise<any> {


  let record = await models.Content.findOne({
    where: { txid }
  })

  if (!record) {

    try {

      let resp = await http.head(`https://media.bitcoinfiles.org/${txid}`)

      let content_type = resp.headers['content-type']

      console.log({ content_type })

      record = await models.Content.create({
        
        txid,

        content_type

      })

    } catch(error) {

      record = await models.Content.create({
        
        txid,

        content_type: null

      })

    }


  }

  let {rows: job_rows} = await pg.raw(`select content, sum(value) as locked_value, sum(difficulty) as work_ordered from "boost_jobs" where content = '${txid}' group by content`)

  record.locked_value = job_rows[0].locked_value
  record.work_ordered = job_rows[0].work_ordered

  let {rows: work_rows} = await pg.raw(`select content, sum(value) as unlocked_value, sum(difficulty) as work_performed from "boost_job_proofs" where content = '${txid}' group by content`)

  if (work_rows[0]) {

    record.unlocked_value = work_rows[0].unlocked_value
    record.work_performed = work_rows[0].work_performed

  } else {

    record.unlocked_value = 0
    record.work_performed = 0

  }

  await record.save()

  return record;

}
