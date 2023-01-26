import { start } from "repl";
import { importBoostProofFromTxHex, importBoostJobFromTxHex } from "../boost";
import { log } from "../log";

const { Listener } = require("bsv-spv");

const boostpow = require('boostpow')

export default async function main() {

  const ticker = "BSV";
  const blockHeight = -10; // Number. If negative then it's number from the tip.
  const dataDir = `${__dirname}/../..`;
  const port = 5200; // Same as Masters port above
  const listener = new Listener({ name: "powco-test-listener", ticker, blockHeight, dataDir });

  const onBlock = ({
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
      console.log(`#${index} tx ${tx.getTxid()} in block ${height}`);
    }
  };

  listener.on("mempool_tx", async ({ transaction, size }) => {

      try {
                  
          const hex = transaction.toBuffer().toString('hex')

          const job = boostpow.BoostPowJob.fromRawTransaction(hex)

          const proof = boostpow.BoostPowJobProof.fromRawTransaction(hex)

          if (job) {

              console.log('JOB: ', job)

              const record = await importBoostJobFromTxHex(hex)

              log.info('bsv-p2p.job.imported', record)
          }

          if (proof) {

              console.log('PROOF: ', proof)

              const record = await importBoostProofFromTxHex(hex, { trusted: true })

              log.info('bsv-p2p.proof.imported', record)
              
          }     

      } catch(error) {
              
          console.log('ERROR: ', error)
      }
  
    /*console.log(
      `new mempool tx ${transaction.getTxid()} ${size.toLocaleString(
        "en-US"
      )} bytes.`
    );*/
  });
  listener.on("block_reorg", ({ height, hash }) => {
    // Re-org after height
  });
  listener.on("block_saved", ({ height, hash }) => {
    listener.syncBlocks(onBlock);
  });

  listener.syncBlocks(onBlock);
  listener.connect({ port });

}

if (require.main === module) {

  start()

}
