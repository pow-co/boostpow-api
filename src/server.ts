
import * as boost from 'boostpow'

import * as boostpow from 'boostpow'

import * as bsv from 'bsv'

const json = require('koa-json')
const Koa = require('koa')
const app = new Koa()
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router');
const router = new Router();

import { importBoostJob, importBoostProof } from './boost'

app.use(json())
app.use(cors())
app.use(bodyParser())
app.use(router.routes())

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

router.post('/node/api/boost_job_transactions', async (ctx, next) => {

  console.log("import job transaction by txid", ctx.request.body)

  let jobs = await importBoostJob(ctx.request.body.txid)

  ctx.body = { jobs }

})

router.post('/node/api/boost_proof_transactions', async (ctx, next) => {

  console.log("import boost proof transaction", ctx.request.body)

  let tx = new bsv.Transaction(ctx.request.body.transaction)

  let graph = boostpow.Graph({})

  let proof = graph.BoostPowJobProof.fromTransaction(tx)

  let record = await importBoostProof(proof)

  ctx.body = { record }

})

// BEGIN BOOSTPOW_API HANDLERS

router.post('/v1/main/boost/jobs', (ctx, next) => {

})

router.post('/v1/main/boost/submitsolution', (ctx, next) => {

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

router.get('/v1/main/boost/search', (ctx, next) => {

})

router.get('/v1/main/boost/id/:id', (ctx, next) => {

})

// END BOOSTPOW_API HANDLERS

export async function startServer() {

  return { app }

}

export { app }


