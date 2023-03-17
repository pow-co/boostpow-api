
import { Op } from 'sequelize'
import { log } from './log';

import models from './models'

import redis from './redis'

import * as moment from 'moment'

export interface RankContent {
    start_date?: Date;
    end_date?: Date;
    tag?: string;
    images?: boolean;
}

export interface Rankings {
    query: RankContent;
    result: RankedContent;
}

export interface RankedContent {
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

export interface RankedTags {
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

type timeframes = 'last-hour' | 'last-day' | 'last-week' | 'last-month' | 'last-year' | 'all-time'

export async function cacheAllTimeframes(): Promise<void> {

  log.info('rankings.cacheAllTimeFrames', {})

  await cacheTimeframe['last-hour']
  await cacheTimeframe['last-day']
  await cacheTimeframe['2-days']
  await cacheTimeframe['3-days']
  await cacheTimeframe['last-week']
  await cacheTimeframe['last-month']
  await cacheTimeframe['last-year']
  await cacheTimeframe['all-time']

}

export async function cacheTimeframe({ timeframe }):  Promise<RankedContent[]> {

  const now = moment()

  let start = now

  switch(timeframe) {

    case 'last-hour':

      start = now.subtract(1, 'hour')

    case 'last-day':

      start = now.subtract(1, 'day')

    case '2-days':

      start = now.subtract(2, 'days')

    case '3-days':

      start = now.subtract(3, 'days')

    case 'last-week':

      start = now.subtract(1, 'week')

    case 'last-month':

      start = now.subtract(1, 'month')

    case 'last-year':

      start = now.subtract(1, 'year')

    case 'all-time':

      start = now.subtract(100, 'years')

  }

  const start_date = start.toDate()

  const result = await rankContent({ start_date })

  await redis.set(`rankings_by_timeframe:${timeframe}`, JSON.stringify(result))

  return result

}

export async function rankContentWithCache({ timeframe, tag }: { timeframe: timeframes, tag?: string }):  Promise<RankedContent[]> {

  const cachedResult = await redis.get(`rankings_by_timeframe:${timeframe}`)

  if (cachedResult) {

    console.log('cachedResult found')

    const json = JSON.parse(cachedResult)

    console.log('FIRST ITEM', json[0])

    return json

  } else {

    console.log('no cacehed result')

    return cacheTimeframe({ timeframe })

  }

}

