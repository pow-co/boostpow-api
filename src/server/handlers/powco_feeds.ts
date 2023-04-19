
import { getCachedMultiDayFeed } from '../../feeds/multi_day_feed'

export async function multiDay(req) {

  const days = await getCachedMultiDayFeed()

  const rankings = days.flat()

  return {

    rankings,

    days

  }

}

