
import { Op } from 'sequelize'

import { badRequest } from 'boom'

import models from '../../models'

export async function show(req, h) {

  try { 

    const message = await models.Contents.findOne({
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

