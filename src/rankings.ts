
import { pg } from './database'

export async function getRankings(startTimestamp?: string): Promise<any[]> {

  // sanitize for sql query to preven injection attack
  var timestamp = parseInt(startTimestamp)

  var date = new Date(timestamp * 1000);

  var query = !!timestamp ?
  `select content, sum(value) as value, sum(difficulty) as difficulty from "boost_job_proofs" where timestamp > to_timestamp(${timestamp}) group by content order by difficulty desc limit 10;`
  : `select content, sum(value) as value, sum(difficulty) as difficulty from "boost_job_proofs" group by content order by difficulty desc limit 10;`

  let {rows: content} = await pg.raw(query)

  let hashes = content.map(item => `'${item.content}'`)

  let {rows: contentTypes} = await pg.raw(`select txid, content_type from "Contents" where txid in (${hashes.join(',')})`);

  let contentTypeMap = contentTypes.reduce((types, item) => {
    types[item.txid] = item.content_type
    return types
  }, {})

  var i = 0;
  return content.map(content => {
    i++
    return Object.assign(content, {
      rank: i,
      content_type: contentTypeMap[content.content],
      difficulty: parseFloat(content.difficulty)
    })
  })

}
