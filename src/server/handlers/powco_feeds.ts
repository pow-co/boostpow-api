
import { getCachedMultiDayFeed } from '../../feeds/multi_day_feed'

export async function multiDay(req) {

  const days = await getCachedMultiDayFeed()

  const rankings = days[0]

  return {

    rankings,

    days.slice(1)

  }

}

