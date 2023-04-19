
import { get_multi_day_feed } from '../../feeds/multi_day_feed'

export async function multiDay(req) {

  const days = await get_multi_day_feed({ days: 7 })

  const rankings = days.flatten()

  return {

    rankings,

    days

  }

}

