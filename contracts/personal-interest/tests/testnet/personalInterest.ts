import { PersonalInterest } from '../../src/contracts/personalInterest'
import { getDefaultSigner, inputSatoshis } from './utils/txHelper'
import { toByteString, sha256, PubKey, bsv } from 'scrypt-ts'

const message = 'hello world, sCrypt!'

async function main() {
    await PersonalInterest.compile()

    const privKey = bsv.PrivateKey.fromRandom()
    const owner = PubKey(privKey.toPublicKey().toHex())

    const instance = new PersonalInterest(sha256(toByteString(message, true)), owner)

    // connect to a signer
    await instance.connect(getDefaultSigner())

    // contract deployment
    const deployTx = await instance.deploy(inputSatoshis)
    console.log('PersonalInterest contract deployed: ', deployTx.id)

    // contract call
    const { tx: callTx } = await instance.methods.unlock(
        toByteString(message, true)
    )
    console.log('PersonalInterest contract `unlock` called: ', callTx.id)
}

describe('Test SmartContract `PersonalInterest` on testnet', () => {
    it('should succeed', async () => {
        await main()
    })
})
