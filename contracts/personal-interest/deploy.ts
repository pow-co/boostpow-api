
import axios from 'axios'
import { PersonalInterest } from './src/contracts/personalInterest'
//import { PersonalInterest } from './dist/src/contracts/personalInterest'
import {
    findSig,
    MethodCallOptions,
    bsv,
    TestWallet,
    DefaultProvider,
    sha256,
    toByteString,
    PubKey,
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
    new DefaultProvider({network: bsv.Networks.mainnet })
)

async function main() {

    await PersonalInterest.compile()

    const amount = parseInt(process.argv[4] || '1000')

    const ownerAddress = process.argv[2] || privateKey.toPublicKey().toHex()

    console.log(privateKey.publicKey.toString())
    console.log(privateKey.publicKey.toAddress().toString(), '--address--')

    //process.exit(0)

    const owner = PubKey(ownerAddress)

    const instance = new PersonalInterest(
        toByteString(process.argv[3] || 'music.house.soul', true),
        owner,
        1n
    )

    // Connect to a signer.
    await instance.connect(signer)

    // Contract deployment.
    const deployTx = await instance.deploy(amount)

    console.log('PersonalInterest contract deployed: ', deployTx.id)

    const { data } = await axios.get('https://pow.co/api/v1/personal-interests/'+deployTx.id)

    console.log(data, 'imported')

    const nextInstance = instance.next()

    nextInstance.weight = 2n

    const { tx: callTx } = await instance.methods.setWeight(2n, (sigResps) =>{
      return findSig(sigResps, privateKey.publicKey)
    }, {
      pubKeyOrAddrToSign: privateKey.publicKey.toAddress(),
      next:{
        instance:nextInstance,
        //@ts-ignore
        balance: instance.balance
      }
    } as MethodCallOptions<PersonalInterest>)

    console.log('PersonalInterest contract call Tx: ', callTx)

    console.log('PersonalInterest contract called: ', callTx.id)


}

main()
