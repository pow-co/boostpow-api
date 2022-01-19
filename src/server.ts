
import * as boost from 'boostpow'

import * as boostpow from 'boostpow'

import { events } from 'rabbi'

import { getRankings, getRankingsTimeframes, getContentRankings } from './rankings'

import { cacheContent } from './content'

import { getAveragePrice } from './prices'

import * as uuid from 'uuid'

import * as bsv from 'bsv'

import { Op } from 'sequelize'

import { getTransaction, call } from './jsonrpc'

const json = require('koa-json')
const Koa = require('koa')
const app = new Koa()
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const respond = require('koa-respond')
const Router = require('koa-router');
const router = new Router();

import * as http from 'superagent'
import * as models from '../models'

import { getBoostJobsFromTx, persistBoostJob, importBoostJob, importBoostProof } from './boost'

app.use(json())
app.use(cors())
app.use(bodyParser())
app.use(router.routes())
app.use(respond())

router.post('/node/api/boost_jobs', (ctx, next) => {

  console.log("format job", ctx.request.body)

  let params = {
    content: ctx.request.body.content,
    diff: parseFloat(ctx.request.body.difficulty)
  }

  let job = boost.BoostPowJob.fromObject(params)

  const asm = job.toASM()
  const hex = job.toHex()

  ctx.body = Object.assign(params, { asm, hex })

})

router.post('/node/api/jobs/new', (ctx, next) => {

  console.log("format job", ctx.request.body)

  let params = {
    content: ctx.request.body.content,
    diff: parseFloat(ctx.request.body.difficulty)
  }

  let job = boost.BoostPowJob.fromObject(params)

  const asm = job.toASM()
  const hex = job.toHex()

  ctx.body = Object.assign(params, { asm, hex })

})

router.post('/node/api/boost_job_transactions', async (ctx, next) => {

  console.log("import job transaction by txid", ctx.request.body)

  await events.emit('boost.job.tx.submission', { txid: ctx.request.body.txid })

  try {

    let jobs = await importBoostJob(ctx.request.body.txid)

    await events.emit('boost.job.tx.imported', { jobs })

    ctx.body = { jobs }

  } catch(error) {

    await events.emit('boost.job.tx.submission.error', { error })

    ctx.body = { error: error.message }

  }

})

router.post('/node/api/boost_proof_transactions', async (ctx, next) => {

  console.log("import boost proof transaction", ctx.request.body)

  let tx = new bsv.Transaction(ctx.request.body.transaction)
  
  console.log('tx', tx)

  let graph = boostpow.Graph({})

  let proof = graph.BoostPowJobProof.fromTransaction(tx)

  let record = await importBoostProof(proof)

  ctx.body = { record }

})

/*
 *
  Log Work Submission
  Validate Work Against Schema
  Log Any Validation Error
  Check If Work Already Performed
  Log Any Duplicate Work
  Check if Work Already Broadcast
  Log If Work Already Broadcast
  Broadcast New Work
  Log If Work Accepted or Rejected
  If Accepted Write Work to Database
 *
 */
router.post('/node/api/work', async (ctx, next) => {

  let request_uid = uuid.v4()

  console.log("import boost proof transaction", ctx.request.body)

  let transaction = ctx.request.body.transaction

  // Log Work Submission
  events.emit('boost.work.tx.submission', { transaction, request_uid })

  var tx;

  try {

    tx = new bsv.Transaction(ctx.request.body.transaction)
    
    console.log('tx', tx)

  } catch(error) {

    events.emit('boost.work.tx.submission.error', { error, request_uid })

    ctx.body = { error: error.message }

    return

  }

  let graph = boostpow.Graph({})

  // Validate Work Against Schema
  let proof = graph.BoostPowJobProof.fromTransaction(tx)

  if (proof) {
    events.emit('boost.work.invalid', { request_uid })
  } else {
    events.emit('boost.work.valid', { proof, request_uid })
  }

  // Check if Work Transaction Already Broadcast

  // Write Work To Database
  let [record] = await importBoostProof(proof)

  if (record) {
    console.log('CACHE CONTENT', record)
    cacheContent(record.content)
  }

  events.emit('boost.work.imported', { record, request_uid })

  ctx.body = { record }


})

router.get('/node/api/content/:txid', async (ctx, next) => {

  let content = await cacheContent(ctx.request.params.txid)

  ctx.body = { content }

})

// BEGIN BOOSTPOW_API HANDLERS

/*
 * 
   Log Job Submission
   Validate Job Against Schema
   Log Any Validation Error
   Check if Job is Broadcast
   Broadcast Job if not Broadcast
   Log Error If Job Not Accepted by Network
   If Valid Write Job To Jobs Database
 *
 */
router.post('/node/api/jobs', async (ctx, next) => {

  let request_uid = uuid.v4()

  let transaction = ctx.request.body.transaction

  console.log('submit job', ctx.request.body)

  // Log Work Submission
  events.emit('boost.job.tx.submission', { transaction, request_uid })

  // Validate Job Against Schema
  var tx;
  try {

    tx = new bsv.Transaction(ctx.request.body.transaction)
    events.emit('boost.job.tx.submission.validtx', { transaction, request_uid })


  } catch(error) {

    // Log Any Validation Error
    events.emit('boost.job.tx.submission.error', { error, request_uid })

    ctx.badRequest({ error: 'invalid job transaction' })
  }

  let jobs = getBoostJobsFromTx(tx)

  if (jobs.length < 1) {

    // Log Any Validation Error
    events.emit('boost.job.tx.submission.error', { error: 'no jobs found', request_uid})
    ctx.badRequest({ error: 'invalid job transaction' })

  }

  for (let job of jobs) {

    let acceptedTx = await getTransaction(tx.hash)

    // check if Job is Broadcast
    if (acceptedTx) {

      events.emit('boost.job.tx.submission.error', { error: 'tx already accepted', request_uid})

    } else {

      try {

        // Broadcast Job if not Broadcast
        let response = await call('sendrawtransaction', [transaction])
        console.log(response)

        events.emit('boost.job.tx.submission.broadcast.accepted', { response, request_uid})
      } catch(error) {
        console.error(error)

        // Log Error If Job Not Accespted By Network
        events.emit('boost.job.tx.submission.broadcast.error', { error, request_uid})
        ctx.badRequest({ error: error })

      }

    }

    // If Valid Write Job to Jobs Database
    let record = await persistBoostJob(job)

    events.emit('boost.job.tx.submission.persisted', { record, request_uid})

    ctx.body = { record }

  }
 
})

router.post('/api/v1/work', (ctx, next) => {

})

router.post('/v1/main/boost/jobs/:txid/proof', (ctx, next) => {

})

router.get('/v1/main/boost/jobs/:txid', (ctx, next) => {

})

interface BoostSearchParams {
  contentutf8?: string;
  content?: string;
  contenthex?: string;
  taghex?: string;
  tagutf8?: string;
  tag?: string;
  categoryutf8?: string;
  category?: string;
  categoryhex?: string;
  usernoncehex?: string;
  additionaldata?: string;
  additionaldatautf8?: string;
  additionaldatahex?: string;
  createdTimeFrom?: number;
  createdTimeEnd?: number;
  mindedTimeFrom?: number;
  mindedTimeEnd?: number;
  unmined?: boolean;
  txid?: string;
  spentTxid?: string;
  boostPowString?: string;
  boostHash?: string;
  boostJobId?: string;
  boostJobProofId?: string;
  limit?: number;
  bigEndian?: boolean;
  debug?: boolean;
  expanded?: boolean;
}

router.get('/node/v1/ranking/value', async (ctx, next) => {

  var limit = ctx.request.query.limit || 100;
  var offset = ctx.request.query.offset || 0;

  var where = {}

  if (ctx.request.query.content_type) {
    where['content_type'] = ctx.request.query.content_type
  }

  if (ctx.request.query.content_category) {
    where['content_type'] = {[Op.like]: `%${ctx.request.query.content_category}%`}
  }

  let content = await models.Content.findAll({
    order: [['locked_value', 'desc']],
    where,
    limit,
    offset
  })


  content = content.map(content => {
    offset++
    return Object.assign(content.toJSON(), { rank: offset })
  })

  ctx.body = { content }

})


router.get('/node/v1/ranking', async (ctx, next) => {

  let timestamp = ctx.request.query.from_timestamp

  let content = await getRankings(timestamp)

  if (content.length === 0) {
    ctx.body = { content: [] }
    return
  }

  let price = await getAveragePrice(timestamp)

  var i = 0;
  content = content.map(content => {
    i++
    return Object.assign(content, { rank: i })
  })
  
  ctx.body = Object.assign(price, { content })

})

router.get('/node/v1/ranking-timeframes', async (ctx, next) => {

  let timeframes = await getRankingsTimeframes()

  ctx.body = { timeframes }

})

router.get('/node/v1/content/:content/rankings', async (ctx, next) => {

  const content = ctx.request.params.content

  let rankings = await getContentRankings(content)

  ctx.body = { content, rankings }

})

router.get('/v1/main/boost/search', (ctx, next) => {



})

router.get('/v1/main/boost/id/:id', (ctx, next) => {

})

// END BOOSTPOW_API HANDLERS

export async function startServer() {

  return { app }

}

export { app }

