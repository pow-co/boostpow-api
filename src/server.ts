
import * as boost from 'boostpow'

const json = require('koa-json')
const Koa = require('koa')
const app = new Koa()
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router');
const router = new Router();

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

router.post('/node/api/boost_job_transactions', (ctx, next) => {

  console.log("format job", ctx.request.body)

  let params = {
    txhex: ctx.request.body.txhex,
    txid: parseFloat(ctx.request.body.txid)
  }

  let job = boost.BoostPowJob.fromRawTransaction(params.txhex)

  const asm = job.toASM()
  const hex = job.toHex()

  ctx.body = Object.assign(params, { asm, hex })

})

export { app }


