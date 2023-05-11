
import { Op } from 'sequelize'

import { badRequest } from 'boom'

import models from '../../models'

import { cacheContent } from '../../content'

export async function show(req, h) {

  try { 

    await cacheContent(req.params.txid)

    const message = await models.Content.findOne({
      where: {
        txid: req.params.txid,
        bitchat_channel: {
          [Op.ne]: null
        }
      }
    })

    return { message }

  } catch(error) {

    return badRequest(error)

  }

}

