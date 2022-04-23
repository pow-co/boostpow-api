
import * as boost from 'boostpow'

export async function create(req, h) {

  const job = boost.BoostPowJob.fromObject(req.payload)

  const hex = job.toHex()

  return h.response({

    script: { hex }

  }).code(201)

}

