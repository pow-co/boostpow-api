
require('dotenv').config()

const { Master, Worker } = require("bsv-spv");
const cluster = require("cluster");

import listener from './listener'

const port = 5251; // Server that new blocks nad mempool txs are announced on

const config = {
  ticker: "BSV", // BTC, BCH, XEC, BSV
  nodes: [
    //`52.77.194.245:8333`,
    `54.174.1.24:8333`,
    `95.165.175.75:8333`,
    `107.6.17.35:8333`,
    `167.99.92.186:8333`,
    `65.108.64.118:8333`
  ],
  // enableIpv6: true,
  forceUserAgent: `Bitcoin SV`, // Disconnects with nodes that do not string match with user agent
  // user_agent: 'Bitcoin SV',
  invalidBlocks: [], // Set if you want to force a specific fork (see examples below)
  dataDir: process.env.bsv_spv_datadir || __dirname, // Directory to store files
  pruneBlocks: 0, // Number of newest blocks you want saved to local disk. 0 to keeping all blocks back to genesis.
  blockHeight: -10, // Sync to block height. 0 to sync to genesis. Negative to sync to X blocks from current heightafter 2 hours
  mempool: 1, // Number of mempool tx threads
  blocks: 1, // Number of bitcoin block threads
};

export default async function start() {

  if (cluster.isWorker) {

    const worker = new Worker();

  } else if (cluster.isPrimary) {

    console.log("bsv-spv.startPrimary")

    const master = new Master(config);

    master.startServer({ port });
  }

  //listener()

}

if (require.main === module) {

  start()

}
