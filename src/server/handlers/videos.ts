require('dotenv').config()

import { badRequest } from 'boom'

import { Server } from 'hapi'
import Joi from 'joi'
import { fetchTransaction } from '../../whatsonchain'
import models from '../../models'

import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import {getSignedUrl, S3RequestPresigner} from "@aws-sdk/s3-request-presigner";


import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3"

const S3 = require('aws-sdk/clients/s3');

const createPresignedUrlWithClient = ({region, bucket, key, sha256Hash, contentLength}: {
  region: string,
  bucket: string,
  key: string,
  sha256Hash: string,
  contentLength: bigint
}) => {
  const client = new S3Client({region});
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ChecksumSHA256: sha256Hash,
    ContentLength: Number(contentLength)
  });
  return getSignedUrl(client, command, {expiresIn: 3600});
};


import { Video, HashedMap, bsv } from '../../../../smart-contracts'

import { ByteString, sha256 } from 'scrypt-ts'

export async function New(req) {

  try {

    const { sha256Hash, contentLength } = req.payload

    const upload_url = await generatePreSignedUrlWithHash({sha256Hash, contentLength: BigInt(contentLength)})

    // TODO: Only provide the upload url once and require the full tx hex to be provided

    return { sha256Hash, upload_url }

  } catch(error) {

    return badRequest(error)

  }

}

export async function create(req) {

  try {

    const { txhex, vout } = req.payload

    const tx = await new bsv.Transaction(txhex)

    if (!tx) {
      throw new Error('Transaction not found')
    }


    const video = Video.fromTx(tx, vout, {
      segments: new HashedMap<bigint, ByteString>()
    })

    // TODO: Validate that the contract contains sufficient satoshis payable to the operator

    // check if the video output has already been spent
    // either accept or reject the video upload contract by calling the Video smart contract

    // return a pre-signed upload link from aws s3

    const upload_url = await generatePreSignedUrlWithHash(video.sha256Hash)

    // TODO: Only provide the upload url once and require the full tx hex to be provided

    return { video, upload_url }

  } catch(error) {

    badRequest(error)

  }

}

export async function show(req) {

  try {

    const [ txid, vout ] = req.params.outpoint.split('_')

    const tx = await fetchTransaction({ txid })

    if (!tx) {
      throw new Error('Transaction not found')
    }

    // TODO: Validate transaction is a Video smart contract transaction

    const video = Video.fromTx(tx, vout, {
      segments: new HashedMap<bigint, ByteString>()
    })

    // check if the video output has already been spent
    // either accept or reject the video upload contract by calling the Video smart contract

    return { video }

  } catch(error) {

    badRequest(error)

  }

}

export async function index(req) {

  try {

    const { owner, limit, offset } = req.params

    const videos = await models.Video.findAll({
      where: {
        owner
      },
      limit,
      offset
    })

    return { videos }

  } catch(error) {

    badRequest(error)

  }

}

export async function destroy() {

  try {

    const video = {}

    return { video }

  } catch(error) {

    badRequest(error)

  }

}

const VideoResponse = Joi.object({
  origin: Joi.string().required(),
  location: Joi.string().required(),
  sha256Hash: Joi.string().required(),
  ipfsHash: Joi.string().required(),
  segments: Joi.array().items(Joi.string()).required(),
  owner: Joi.string().required(),
  operator: Joi.string().required()
})

export default async function (server: Server) {

  server.route({
    path: '/api/v1/videos',
    method: 'POST',
    handler: New,
    options: {
      description: 'Get a new upload url for a video given its sha256 hash',
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

    server.route({
        path: '/api/v1/videos/{outpoint}',
        method: 'GET',
        handler: show,
        options: {
          description: 'Get a video based on an outpoint',
          tags: ['api', 'rankvideosings'],
          response: {
            failAction: 'log',
            schema: Joi.object({
              video: VideoResponse.required()
            })
          },
          validate: {
            params: Joi.object({
              outpoint: Joi.string().required()            
            }).required()
          }
        }
    })

    server.route({
        path: '/api/v1/videos',
        method: 'GET',
        handler: index,
        options: {
          description: 'List Onchain Videos Available For Streaming On Demand',
          tags: ['api', 'videos'],
          response: {
            failAction: 'log',
            schema: Joi.object({
              videos: Joi.array().items(VideoResponse.required())
            })
          },
          validate: {
            query: Joi.object({
              owner: Joi.string().optional(),
              limit: Joi.number().integer().min(1).max(100).default(100).optional(),
              offset: Joi.number().integer().min(0).default(0).optional()
            }).optional()
          }
        },

    })

    /*server.route({
        path: '/api/v1/videos',
        method: 'POST',
        handler: create,
        options: {
          description: 'Create a new video from a Video smart contract transaction',
          tags: ['api', 'videos'],
          response: {
            failAction: 'log',
            schema: Joi.object({
              video: VideoResponse.required()
            })
          },
          validate: {
            payload: Joi.object({
              txid: Joi.string().required(),
              vout: Joi.number().integer().min(0).required()
            }).required()
          }
        }        
    })
    */
 

}

import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1',
});

async function generatePreSignedUrlWithHash({sha256Hash, contentLength}: {sha256Hash: string, contentLength: bigint}): Promise<string> {

  const resultUrl = await createPresignedUrlWithClient({
    region: 'us-east-1',
    bucket: 'powco-hls',
    key: `${sha256Hash}.mp4`,
    sha256Hash: sha256Hash,
    contentLength
  })

  return resultUrl

}

function getPresignUrlPromiseFunction(s3, s3Params): Promise<string>{
    return new Promise(async (resolve, reject) => {
    try {
        await s3.getSignedUrl('putObject', s3Params, function (err,         data) {
    if (err) {
    return reject(err);
    }
    resolve(data);
  });
} catch (error) {
    return reject(error);
    }
  });
}

