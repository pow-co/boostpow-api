
import { cacheContent } from '../../content'

import models from '../../models'

import { badRequest } from 'boom'

import { log } from '../../log'

export async function show(req) {

    try {

        const [content] = await cacheContent(req.params.txid)

        let tags = await models.BoostWork.findAll({
          where: {
            content: req.params.txid
          },
          group: ['tag'],
          attributes: [
            'tag',
            [
              models.sequelize.fn('sum', models.sequelize.col('difficulty')),
              'difficulty'
            ]
          ]
        })

        tags = tags.map(tag => {

          return {
            hex: tag.tag,
            utf8: Buffer.from(tag.tag, 'hex').toString('utf8'),
            difficulty: tag.difficulty
          }

        })

        return { content: content.toJSON(), tags }
        
    } catch(error) {

        log.error('api.handlers.content.show.error', error)

        return badRequest(error.message)

    }

}
