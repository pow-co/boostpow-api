
import models from '../../models'

import { badRequest }from 'boom'

export async function index(req, h) {

  try {

    let replies = await models.Content.findAll({
      where: { context_txid: req.params.txid },
      include: [{
        model: models.BoostWork,
        as: 'boost_work'
      }]
    })

    replies = replies.map(reply => {

      reply = reply.toJSON()

      reply.difficulty = reply.boost_work.reduce((sum, work) => {
        return sum + work.difficulty
      }, 0) 

      delete reply.boost_work

      return reply

    })

    return { replies }

  }catch(error){

    return badRequest(error)

  }

}
