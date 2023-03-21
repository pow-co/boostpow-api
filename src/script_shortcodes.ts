
import { Script } from 'bsv'

import { v4 } from 'uuid'

import models from './models'

export interface ScriptShortcode {
  script: string;
  uid: string;
}

export async function findOrCreate({script}: {script: string}): Promise<ScriptShortcode> {

  Script.fromHex(script)

  const [record] = await models.ScriptShortcode.findOrCreate({
    where: { script },
    attributes: ['script', 'uid'],
    defaults: {
      script,
      uid: v4()
    }
  })

  return {
    script: record.script,
    uid: record.uid
  }

}

export async function find({uid}: {uid: string}): Promise<ScriptShortcode> {

  const record = await models.ScriptShortcode.findOne({
    where: { uid },
    attributes: ['script', 'uid']
  })

  if (!record) {

    throw new Error(`script short code ${uid} not found`)

  }

  return {
    script: record.script,
    uid: record.uid
  }

}

