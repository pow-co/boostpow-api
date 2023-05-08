
import models from '../../models'

import { badRequest }from 'boom'

export async function index(req, h) {

  try {

    const replies = await models.Content.findAll({
      where: { context_txid: req.params.txid }
    })

    return { replies }

  }catch(error){

    return badRequest(error)

  }

}
