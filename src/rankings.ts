
import { Op } from 'sequelize'
import { log } from './log';

import models from './models'

interface RankContent {
    start_date?: Date;
    end_date?: Date;
    tag?: string;
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

    return proofs

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
