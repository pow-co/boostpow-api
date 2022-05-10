
import { getRankings, getRankingsTimeframes, getContentRankings } from '../../rankings'

export async function index(request, hapi) {

  try {

    const { from_timestamp } = request.query

    console.log({ from_timestamp })

    const options = {}

    if (request.query.tag) {

      options['tag'] = request.query.tag

    }

    let rankings = await getRankings(from_timestamp, options)

    return hapi.response({ rankings }).code(200)

  } catch(error) {

    return hapi.response({ error: error.message }).code(500)

  }

}

