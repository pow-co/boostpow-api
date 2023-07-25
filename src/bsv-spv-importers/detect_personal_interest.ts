
import { PersonalInterest , detectInterestsFromTxid } from '../contracts/personal-interest'

import { bsv } from 'scrypt-ts'

const txid = 'b0704b4e1e6c6f69f83a430c9d76c564a616e06b163f7eceb78f4a1ed9ebdd30'

const { Listener } = require("bsv-spv");

const name = "personal-interests";
const ticker = "BSV";
const blockHeight = -10; // Number. If negative then it's number from the tip.
const dataDir = __dirname
const port = 8080; // Same as Masters port above
const listener = new Listener({ name, ticker, blockHeight, dataDir });

export async function main() {

  //await PersonalInterest.loadArtifact(require('./contracts/personal-interest/scrypt.index.json'))
  await PersonalInterest.compile()

  let [interests, txhex] = await detectInterestsFromTxid(txid)

  const tx = new bsv.Transaction(txhex)

  console.log(interests, 'interests')

  for (let interest of interests) {

    console.log({
      txid,
      outputIndex: interest.from.outputIndex,
      topic: Buffer.from(interest.topic, 'hex').toString('utf8'),
      owner: new bsv.PublicKey(interest.owner).toAddress().toString(),
      weight: Number(interest.weight),
      value: tx.outputs[interest.from.outputIndex].satoshis
    })

  }

}

main()
