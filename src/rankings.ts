
import { Op } from 'sequelize'
import { log } from './log';

import models from './models'

interface RankContent {
    start_date?: Date;
    end_date?: Date;
    tag?: string;
    images?: boolean;
}

interface Rankings {
    query: RankContent;
    result: RankedContent;
}

interface RankedContent {
    content: string;
    difficulty: number;
    rank: number;
    tag: number;
}

export async function rankContent (params: RankContent = {}): Promise<RankedContent[]> {

    const where = {}

    if (params.start_date) {
  
      where['timestamp'] = {
        [Op.gte]: params.start_date
      }
    
    }
  
    if (params.end_date) {
  
      where['timestamp'] = {
        [Op.lte]: params.end_date
      }
  
    }

    if (params.tag) {
        
        where['tag'] = params.tag

    }

    log.info('rankings.rankContent', {params, where})

    const proofs = await models.BoostWork.findAll({

        where,
  
        attributes: [
          'content',
          [models.sequelize.fn('sum', models.sequelize.col("difficulty")), "difficulty"],
          [models.sequelize.fn('count', models.sequelize.col("id")), "count"],
        ],
  
        group: 'content',
  
        order: [['difficulty', 'desc']],

    })

    var default_type = {
      [Op.ne]: null
    }

    
    const image_type = {
      [Op.like]: 'image%',
      [Op.ne]: null
    }

    const content_type = params.images ? image_type : default_type


    var contents = await models.Content.findAll({

      where: {

        txid: {
          [Op.in]: proofs.map(proof => proof.content)
        },

        content_type
      }

    })

    /*const contentsMap = contents.filter(content => {
      return content.content_type.match(/image/)
    }).*/
    const contentsMap = contents.reduce((map, content) => {

      map[content.txid] = {
        content_type: content.content_type,
        content_text: content.content_text,
        txid: content.txid
      }

      return map

    }, {})

    const proofsWithContent = proofs.map(proof => {

      const content = contentsMap[proof.content]

      if (content) {

        proof.content_type = content.content_type

        proof.content_text = content.content_text

      }

      if (params.images && (!content || !content.content_type.match(/image/))) {
        return

      }

      return {

        content_txid: proof.content,

        content_type: proof.content_type,

        content_text: proof.content_text,

        difficulty: parseFloat(proof.difficulty),

        count: parseInt(proof.count)

      }

    }).filter(proof => !!proof)

    return proofsWithContent;

}

interface RankedTags {
    query: RankContent;
}

export async function rankTags(params: RankContent = {}): Promise<RankedTags[]> {

    const where = {}

    if (params.start_date) {
  
      where['timestamp'] = {
        [Op.gte]: params.start_date
      }
    
    }
  
    if (params.end_date) {
  
      where['timestamp'] = {
        [Op.lte]: params.end_date
      }
  
    }

    const proofs = await models.BoostWork.findAll({

        where,
  
        attributes: [
          'tag',
          [models.sequelize.fn('sum', models.sequelize.col("difficulty")), "difficulty"],
          [models.sequelize.fn('count', models.sequelize.col("id")), "count"],
        ],
  
        group: 'tag',
  
        order: [['difficulty', 'desc']],

    })

    return proofs

}
