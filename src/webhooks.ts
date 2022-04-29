
import * as models from './models';

import { log } from 'rabbi'

import * as http from 'superagent';

export async function sendWebhooks(boostWork) {

  let webhooks = await models.Webhook.findAll()

  const json = {}

  for (let webhook of webhooks) {

    await sendWebhook(webhook, boostWork)

  }

}

export async function sendWebhook(webhook, boostWork) {

  var response_code, response_body, error, ended_at, started_at;

  started_at = new Date()

  try {

    let resp = await http.post(webhook.url).send(boostWork.toJSON());

    console.log(resp)

    response_code = resp.statusCode; 

    response_body = resp.body; 

    if (typeof resp.body !== 'string') {
      response_body = JSON.stringify(resp.body); 
    } else {
      response_body = resp.body; 
    }

    ended_at = new Date();

  } catch(error) {

    console.log(error)

    response_code = error.response.statusCode;

    if (typeof error.response.body !== 'string') {
      response_body = JSON.stringify(error.response.text); 
    } else {
      response_body = error.response.body; 
    }
    error = error.message;

    ended_at = new Date();

  }

  await models.WebhookRecord.create({
    started_at,
    job_txid: boostWork.job_txid,
    response_code,
    response_body,
    error,
    ended_at,
    url: webhook.url,
  })

  return webhook;

}

