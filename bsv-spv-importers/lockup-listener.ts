require('dotenv').config()

const { Listener } = require("bsv-spv");

const name = "lockup";
const ticker = "BSV";
const blockHeight = 807000; // Number. If negative then it's number from the tip.
const dataDir = __dirname;
const port = 8080; // Same as Masters port above
const listener = new Listener({ name, ticker, blockHeight, dataDir });

const { connect } = require('amqplib')

import { bsv } from "scrypt-ts"
import axios from "axios"
import { detectLockupFromTxHex } from "../src/contracts/lockup";

var amqp;

async function startAmqp() {

	const connection = await connect(process.env.amqp_url)

	amqp = await connection.createChannel()

	await amqp.assertExchange('powco')

}

startAmqp()


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

    let [lockup, vout] = await detectLockupFromTxHex(hex)

    if(lockup){

      try {
  
        const result = await axios.post('https://hls.pow.co/api/v1/contracts', {
            origin: `${tx.hash}_${vout}`,
            class_name: 'Lockup', 
            props: {
                lockUntilHeight: lockup.lockUntilHeight,
                pkhash: lockup.pkhash
            }
        })
        
      } catch (error) {
        
        console.log('ingest.lockup.error', error)
  
      }
      
    }


  }
};

listener.on("mempool_tx", async ({ transaction, size }) => {

	try {

    const hex = transaction.toHex()

    let [lockup, vout] = await detectLockupFromTxHex(hex)

    if(lockup){
      
      try {
  
        const result = await axios.post('https://hls.pow.co/api/v1/contracts', {
            origin: `${transaction.hash}_${vout}`,
            class_name: 'Lockup', 
            props: {
                lockUntilHeight: lockup.lockUntilHeight,
                pkhash: lockup.pkhash
            }
        })
        
      } catch (error) {
        
        console.log('ingest.lockup.error', error)
        
      }
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
