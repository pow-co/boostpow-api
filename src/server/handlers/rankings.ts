
import { rankContent, rankTags, rankContentWithCache, RankedContent } from '../../rankings'

export async function index(req) {

    let { start_date, end_date, tag } = req.query

    if (start_date) {
        start_date = new Date(start_date * 1000)
    }

    if (end_date) {
        end_date = new Date(end_date * 1000)
    }

    const rankings: RankedContent = await rankContent({
        start_date,
        end_date,
        tag
    })

    return { rankings }

}

const timeframes = ['last-day', 'last-week', 'last-month', 'last-year', 'all-time']

export async function byTimeframe(req) {

  let { timeframe, tag } = req.params

  const rankings = await rankContentWithCache({
    timeframe, tag
  })

  return { rankings }

}

export async function images(req) {

    let { start_date, end_date, tag } = req.query

    if (start_date) {
        start_date = new Date(start_date * 1000)
    }

    if (end_date) {
        end_date = new Date(end_date * 1000)
    }

    const params = {
        start_date,
        end_date,
        tag,
        images: true
    }

    const rankings = await rankContent(params)

    return { rankings }

}

export async function tags(req) {

    let { start_date, end_date } = req.query

    if (start_date) {
        start_date = new Date(start_date * 1000)
    }

    if (end_date) {
        end_date = new Date(end_date * 1000)
    }

    const rankings = await rankTags({
        start_date,
        end_date
    })

    return { rankings }
    
}
