
import { pg } from './database'

import * as moment from 'moment'

interface RankingOptions {
  tag?: string;
}

export async function getRankings(startTimestamp?: number, options: RankingOptions = {}): Promise<any[]> {

  // sanitize for sql query to preven injection attack
  var timestamp = startTimestamp

  console.log({ timestamp })

  if (!timestamp) { timestamp = 0 }

  var date = new Date(timestamp * 1000);

  var result;

  console.log({ timestamp })

  if (options['tag']) {

    let query = `select content, sum(value) as value, sum(difficulty) as difficulty from "boost_job_proofs" where timestamp > to_timestamp(?) and tag = ? group by content order by difficulty desc limit 1000;`

    result = await pg.raw(query, [timestamp, options['tag']])

  } else {

    let query = `select content, sum(value) as value, sum(difficulty) as difficulty from "boost_job_proofs" where timestamp > to_timestamp(?) group by content order by difficulty desc limit 1000;`

    result = await pg.raw(query, [timestamp])
  }

  const content = result.rows

  //let {rows: content} = await pg.raw(query)

  if (content.length === 0) { return [] }

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
      difficulty: parseFloat(content.difficulty),
      value: parseFloat(content.value)
    })
  })

}

const timeframes = ['hour', 'day', 'week', 'month', 'year', 'alltime']

function getTimestamps () {

  return timeframes.map(timeframe => {

    var n: number = 1
    var interval = timeframe

    if (timeframe === 'alltime') {
      n = 20
      interval = 'years'
    }

    var date: any = moment()

    var timestamp: any = date.subtract(n, interval).toDate().getTime() / 1000

    return {
      name: timeframe,
      timestamp: parseInt(timestamp)
    }
  })

}


export async function getRankingsTimeframes() {

  let timeframes = getTimestamps()

  return Promise.all(timeframes.map(async timeframe => {

    let rankings = await getRankings(timeframe.timestamp)

    return Object.assign(timeframe, { rankings })

  }))
  
}

export async function getContentRankings(content: string) {

  let rankings = await getRankingsTimeframes()

  return rankings.map(timeframe => {

    let contentRank = timeframe.rankings.filter(ranking => {

      return ranking.content === content

    })[0]

    var rank, difficulty, value

    if (contentRank) {

      rank = contentRank.rank
      difficulty = contentRank.difficulty,
      value = contentRank.value

    } else {

      rank = 0
      difficulty = 0
      value = 0
    }

    var response = {}
    response[timeframe.name] = {
      timestamp: timeframe.timestamp,
      name: timeframe.name,
      rank,
      difficulty,
      value
    }
    return response

  })

}

