
import { Op } from 'sequelize'
import models, { sequelize } from '../../models'

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

export async function listContent(req, h) {

  if (!req.params.identity) return h.response({ error: 'no identity provided' }).code(400)

  const contents = await models.Content.findAll({
    where: {
      [Op.or]: [
        sequelize.where(
          sequelize.literal(`bmap#>>'{MAP, 0, paymail}'`), '=', req.params.identity
        ),
        sequelize.where(
          sequelize.literal(`bmap#>>'{MAP, 0, pubkey}'`), '=', req.params.identity
        ),

      ]
    },
    order: [
      ['id', 'DESC'],
    ],
    limit: req.query.limit || 100,
    offset: req.query.offset || 0
  });

  return { contents: contents.map(c => c.toJSON()) }

}
