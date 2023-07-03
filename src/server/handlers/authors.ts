
import models from '../../models'

// list authors by difficulty of mined jobs purchased 
// returns {"address": "difficulty"}
export async function index(req, h) {



}

export async function show(req, h) {

  const { address } = req.params

  const { limit, offset, spent } = req.query

  const where = {

    bitcoin_signed_message_address: address

  }

  if (spent) {

    where['spent'] = spent

  }

  const query = {

    where,

    order: [['createdAt', 'desc']]

  }

  if (limit) {

    query['limit'] = limit 

  }

  if (offset) {

    query['offset'] = offset 

  }

  const jobs = await models.BoostJob.findAll(query)

  return { address, jobs }

}
