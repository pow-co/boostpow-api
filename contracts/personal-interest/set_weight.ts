
import axios from 'axios'

import { PersonalInterest } from './src/contracts/personalInterest'
//import { PersonalInterest } from './dist/src/contracts/personalInterest'
import {
    bsv,
    TestWallet,
    DefaultProvider,
    sha256,
    toByteString,
    PubKey,
    findSig,
    MethodCallOptions
} from 'scrypt-ts'

import * as dotenv from 'dotenv'

// Load the .env file
dotenv.config()

// Read the private key from the .env file.
// The default private key inside the .env file is meant to be used for the Bitcoin testnet.
// See https://scrypt.io/docs/bitcoin-basics/bsv/#private-keys
const privateKey = bsv.PrivateKey.fromWIF(process.env.PRIVATE_KEY || '')

// Prepare signer.
// See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
const signer = new TestWallet(
    privateKey,
    new DefaultProvider({network:bsv.Networks.mainnet})
)

async function main() {

    await PersonalInterest.compile()

    const txid = process.argv[2]

    console.log(signer.connectedProvider, 'connectedProvider')

    const tx = await signer.connectedProvider.getTransaction(txid)

    const weight = parseInt(process.argv[3])

    const instance = PersonalInterest.fromTx(tx, 0)

    // Connect to a signer.
    await instance.connect(signer)

    const nextInstance = instance.next()

    nextInstance.weight = 2n

    const { tx: callTx } = await instance.methods.setWeight(2n, (sigResps) =>{
      return findSig(sigResps, privateKey.publicKey)
    }, {
      next:{
        instance: nextInstance,
        balance: instance.balance
      },
      pubKeyOrAddrToSign: privateKey.publicKey.toAddress()
    } as MethodCallOptions<PersonalInterest>)

    console.log('PersonalInterest contract call Tx: ', callTx)

    console.log('PersonalInterest contract called: ', callTx.id)

}

main()
