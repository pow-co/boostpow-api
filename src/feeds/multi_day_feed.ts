
import { rankContent, RankedContent } from '../rankings'

export async function get_multi_day_feed({ days }: { days?: number }): Promise<RankedContent[]> {

  const txids = {}

  const rankedContents = []

  for (let i=0; i < days; i++) {

    let rankedContent = rankContent({
      start_date: moment().subtract(i + 1, 'days').toDate(),
      end_date: moment().subtract(i, 'days').toDate()
    })

    rankedContent = rankedContent.filter((ranking) => {

      if (txids[ranking.content]) {

        return false
    
      }

      txids[ranking.content] = true

      return true

    })

    rankedContents.push(rankedContent)

  }

  return rankedContents

}

