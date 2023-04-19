
import { rankContent, RankedContent } from '../rankings'

import redis from '../redis'

import moment from 'moment'

export async function cacheMultiDayFeed() {

  const result = await get_multi_day_feed({ days: 7 })

  await redis.set(`multi_day_feed`, JSON.stringify(result))
}

export async function getCachedMultiDayFeed() {

  const result = await redis.get('multi_day_feed')

  if (!result) {

	  await cacheMultiDayFeed()

	  const result = await redis.get('multi_day_feed')
  }

  return JSON.parse(result)
}

export async function get_multi_day_feed({ days }: { days?: number }): Promise<RankedContent[]> {

  const txids = {}

  const rankedContents = []

  for (let i=0; i < days; i++) {

    let start_date = moment().subtract(i + 1, 'days').toDate()
    let end_date = moment().subtract(i, 'days').toDate()

    let rankedContent = await rankContent({
      start_date
    })

    rankedContent = rankedContent.filter((ranking) => {

      if (txids[ranking.content_txid]) {

        return false
    
      }

      txids[ranking.content_txid] = true

      return true

    })

    rankedContents.push(rankedContent)

  }

  return rankedContents

}

