
import pg from './database'

export async function getAveragePrice(startTimestamp?: string) {

  var timestamp = parseInt(startTimestamp)

  var date = new Date(timestamp * 1000);

  var query = !!timestamp ?
  `select sum(difficulty) as difficulty, sum(value) as value from "boost_job_proofs" where timestamp > to_timestamp(${timestamp});`
  : `select sum(difficulty) as difficulty, sum(value) as value from "boost_job_proofs";`

  let {rows: sums} = await pg.raw(query)

  let difficulty = parseFloat(sums[0].difficulty)
  let value = parseFloat(sums[0].value)

  let price = value / difficulty

  return {
    total_difficulty: difficulty,
    total_value: value,
    price_per_difficulty: price
  }

}
