
import * as boost from 'boostpow'

export async function create(req, h) {

  var { difficulty: diff, content, tag, category, additionalData, userNonce } = req.payload

  if (tag) {
    tag = Buffer.from(tag, 'utf8').toString('hex')
  }

  if (category) {
    category = Buffer.from(category, 'utf8').toString('hex')
  }

  const job = boost.BoostPowJob.fromObject({
    content,
    diff,
    tag,
    category,
    additionalData,
    userNonce
  })

  const hex = job.toHex()

  const json = job.toObject()

  return h.response({

    script: { hex, json }
    
  }).code(201)

}

