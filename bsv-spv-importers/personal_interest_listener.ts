require('dotenv').config()

const { Listener } = require("bsv-spv");

const name = "personal-interests";
const ticker = "BSV";
const blockHeight = -10; // Number. If negative then it's number from the tip.
const dataDir = __dirname;
const port = 8080; // Same as Masters port above
const listener = new Listener({ name, ticker, blockHeight, dataDir });

const { connect } = require('amqplib')

import { PersonalInterest, detectInterestsFromTxHex } from '../contracts/personal-interest/src'

var amqp;

async function startAmqp() {

	const connection = await connect(process.env.amqp_url)

	amqp = await connection.createChannel()

	await amqp.assertExchange('powco')

}

startAmqp()

const { TransformTx, bobFromRawTx }  = require('bmapjs')

/** Example
 *
 *
 * {
  tx: {
    h: 'f9fc39e00bdfb26762d6d70ffe4fdba4841dec83c65bc06a9f9a7cbaa1c5b49e'
  },
  in: [ { i: 0, e: [Object], seq: 4294967295 } ],
  B: [
    {
      content: 'Success! I am detecting bitchat transactions in real time using bsv-spv  :D',
      'content-type': 'text/plain',
      encoding: 'utf-8'
    }
  ],
  MAP: [
    {
      cmd: 'SET',
      app: 'chat.pow.co',
      type: 'message',
      paymail: 'owenkellogg@relayx.io',
      context: 'channel',
      channel: 'test'
    }
  ],
  lock: 0
}

****/


async function parseTransaction(tx) {

	const hex = tx.toHex()

	const bob = await bobFromRawTx(hex)

	let transformed = await TransformTx(bob)

	return [hex, bob, transformed]

}

const onBlock = async ({
  header,
  started,
  finished,
  size,
  height,
  txCount,
  transactions,
  startDate,
}) => {
  for (const [index, tx, pos, len] of transactions) {

    const hex = tx.toHex()

    let interests = await detectInterestsFromTxHex(hex)

    for (let interest of interests) {

      console.log(interest, 'interest')
    }

  }
};

listener.on("mempool_tx", async ({ transaction, size }) => {

	try {

    const hex = transaction.toHex()

    let interests = await detectInterestsFromTxHex(hex)

    for (let interest of interests) {

      console.log(interest, 'interest')
    }

	} catch(error) {

	}

});
listener.on("block_reorg", ({ height, hash }) => {
  // Re-org after height
});
listener.on("block_saved", ({ height, hash }) => {
  listener.syncBlocks(onBlock);
});

listener.syncBlocks(onBlock);
listener.connect({ port });
