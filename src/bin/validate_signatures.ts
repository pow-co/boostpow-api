
require('dotenv').config()

import models from '../models'

import { Op } from 'sequelize'

const Message = require('bsv-message')

export default async function main() {

  const jobs = await models.BoostJob.findAll({

    where: {
      //txid: '3112d0342bb3ed5ee0caf365b1dc9470d5d10cd137d629cfc7cd45a99a01b7f7'

      additionalData: {

        [Op.ne]: ''

      },

      bitcoin_signed_message_address: {

        [Op.eq]: null

      }

    },

    order: [['createdAt', 'desc']]

  })

  const validSignatures = []

  for (let job of jobs) {

    try {

      const message = await setBitcoinSignature(job) 

      if (message) {

        console.log(message)

        validSignatures.push(message)

      }

    } catch(error) {

      //console.log(error)

    }
  
  }

  console.log(`In total ${validSignatures.length} jobs have potentially valid signatures`)

}

type Job = any

interface BitcoinSignedMessageResult {
  algorithm: string;
  key: string;
  address: string;
  data: string;
  value: string;
}

async function setBitcoinSignature(job: Job): Promise<BitcoinSignedMessageResult | void> {

  const message: BitcoinSignedMessageResult | void = await getBitcoinSignature(job)

  if (!message) { return }

  console.log({ job, message })

  if (!job.bitcoin_signed_message_address && message.address) {

    job.bitcoin_signed_message_signature = message.value

    job.bitcoin_signed_message_address = message.address

    await job.save()

  }

  return message

}

async function getBitcoinSignature(job: Job): Promise<BitcoinSignedMessageResult | void> {

  try {

    const utf8 = Buffer.from(job.additionalData, 'hex').toString('utf8')

    const message = JSON.parse(utf8)

    const { algorithm, key, address, data, value } = message

    if (algorithm !== 'bitcoin-signed-message') return;
    if (key !== 'identity') return;
    if (!address || !data || !value) return;

    const verified = Message(data).verify(address, value)

    if (!verified) { return }

    return message

  } catch(error) {

  }

}

main()
