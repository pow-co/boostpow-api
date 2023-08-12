require('dotenv').config()

import { badRequest } from 'boom'

import { Server } from 'hapi'

import Joi from 'joi'

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

export default async function (server: Server) {

  server.route({
    path: '/api/v1/videos/uploads',
    method: 'POST',
    handler: New,
    options: {
      description: 'Get a new upload url for a video given its sha256 hash and content length',
      tags: ['api', 'videos'],
      response: {
        failAction: 'log',
        schema: Joi.object({
          sha256Hash: Joi.string().required(),
          contentLength: Joi.number().required(),
          upload_url: Joi.string().required()
        })
      },
      validate: {
        payload: Joi.object({
          sha256Hash: Joi.string().required(),
          contentLength: Joi.number().required()
        }).required()
      }
    }
  })

}
export async function New(req) {

  try {

    const { sha256Hash, contentLength } = req.payload

    const client = new S3Client({region: 'us-east-1'});

    const command = new PutObjectCommand({
      Bucket: 'powco-hls',
      Key: `${sha256Hash}.mp4`,
      ChecksumSHA256: sha256Hash,
      ContentLength: Number(contentLength)
    });

    const upload_url = await getSignedUrl(client, command, {expiresIn: 3600});

    return { sha256Hash, upload_url }

  } catch(error) {

    return badRequest(error)

  }

}
