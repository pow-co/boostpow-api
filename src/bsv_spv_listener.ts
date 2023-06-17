require('dotenv').config()

const { Listener } = require("bsv-spv");

const {BoostPowJob, BoostPowJobProof} = require('boostpow')

import { importBoostProofFromTxHex, importBoostJobFromTxHex } from './boost'

const axios = require('axios')

export default async function main() {

	const port = process.env.bsv_spv_port || 8080; // Same as Masters port above

	const listener = new Listener({
		name: "boostpow-listener-powco",
		ticker: "BSV",
		blockHeight: -6 * 24 * 7,
		dataDir: process.env.bsv_spv_directory || __dirname
	});


	async function handleTransaction(tx) {

	   let hex = tx.toHex()

	   const job = BoostPowJob.fromRawTransaction(hex)

	   if (job) {

		   try {

			console.log('boostpow.job.discovered', job)

		   	const { data } = await axios.get(`https://pow.co/api/v1/boost/jobs/${job.txid}`)

		   	console.log(data)

		   } catch(error) {

			console.error('boostpow.job.import.error', error)

		   }

		   try {

			const jobsImported = await importBoostJobFromTxHex(hex)

			console.log(jobsImported, 'jobs.imported')

		   } catch(error) {

			console.error('boostpow.job.import.error', error)

		   }
	   }

	   const proof = BoostPowJobProof.fromRawTransaction(hex)
	   if (proof) {

		   console.log('boostpow.proof.discovered', proof)

		   const { data } = await axios.post(`https://pow.co/api/v1/boost/proofs/${proof.txid}`)
		   //
		   console.log(data)

		   try {

		        const proofsImported = await importBoostProofFromTxHex(hex, { trusted: true })

			console.log(proofsImported, 'proofs.imported')

		   } catch(error) {

			console.error('boostpow.job.import.error', error)

		   }

	   }

	}

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

	     handleTransaction(tx)

	  }

	};


	listener.on("mempool_tx", ({ transaction, size }) => {

	    handleTransaction(transaction)

	   /*let hex = transaction.toHex()

	   const job = BoostPowJob.fromRawTransaction(hex)
	   if (job) {

		   console.log('boostpow.job.discovered', job)
	   }

	   const proof = BoostPowJobProof.fromRawTransaction(hex)
	   if (proof) {

		   console.log('boostpow.proof.discovered', proof)
	   }
	   */

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

	main()

}
