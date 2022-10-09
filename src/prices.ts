
import axios from 'axios'

import BigNumber from 'bignumber.js'
import config from './config'
import { log } from './log'

const USD_PER_DIFFICULTY=100

export async function convert(satoshis: number, currency: string): Promise<number> {

  let bsv = new BigNumber(satoshis).dividedBy(100000000).toNumber()

  let { data } = await axios.get(`https://api.anypayx.com/convert/${bsv}-BSV/to-${currency}`)

  return data.conversion.output.value

}

export async function convertPrice(value: number, input: string, output: string) {

  let { data } = await axios.get(`https://api.anypayx.com/convert/${value}-${input}/to-${output}`)

  return data.conversion.output.value

}

export function toSatoshis(bsv_amount: number): number {
  return new BigNumber(bsv_amount).times(100000000).toNumber()
}

interface DifficultyQuote {
  satoshis: number;
  difficulty: number;
}

interface QuoteDiffifculty {
  currency: string;
  value: number;
  difficulty: number;
}

export async function quoteDifficulty({ currency, value, difficulty }: QuoteDiffifculty): Promise<DifficultyQuote> {

  log.info('difficulty.quote', { currency, value, difficulty })

  const bsv_amount = await convertPrice(value, currency, 'BSV')

  currency = 'BSV'

  if (!difficulty) {

    difficulty = new BigNumber(value).dividedBy(config.get('bsv_per_difficulty')).toNumber()

  }

  const satoshis = toSatoshis(bsv_amount)

  log.info('difficulty.quote.result', { currency, value, satoshis, difficulty})

  return { satoshis, difficulty }

}
