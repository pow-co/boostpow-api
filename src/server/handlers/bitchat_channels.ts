
import { Op } from 'sequelize'

import { badRequest } from 'boom'

import models from '../../models'

export async function index(req, h) {

  try { 

    const channels = await models.Content.findAll({
      where: {
        bitchat_channel: {
          [Op.ne]: null
        }
      },
      group: ['bitchat_channel'],
      attributes: ['bitchat_channel']
    })

    return { channels }

  } catch(error) {

    return badRequest(error)

  }

}

export async function show(req, h) {

  const { channel } = req.params

  try { 

    const messages = await models.Content.findAll({
      where: {
        bitchat_channel: channel
      },
      order: [['id', 'desc']]
    })

    return {

      channel,

      messages

    }

  } catch(error) {

    return badRequest(error)

  }

}
