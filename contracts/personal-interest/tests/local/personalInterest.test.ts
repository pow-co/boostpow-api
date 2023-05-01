import { expect, use } from 'chai'
import { MethodCallOptions, sha256, toByteString, bsv, PubKey } from 'scrypt-ts'
import { PersonalInterest } from '../../src/contracts/personalInterest'
import { getDummySigner, getDummyUTXO } from './utils/txHelper'
import chaiAsPromised from 'chai-as-promised'
use(chaiAsPromised)

describe('Test SmartContract `PersonalInterest`', () => {
    let instance: PersonalInterest

    before(async () => {
        await PersonalInterest.compile()

        const signer = getDummySigner()


        console.log(signer)

        const privKey = bsv.PrivateKey.fromRandom()
        const owner = PubKey(privKey.toPublicKey().toHex())

        instance = new PersonalInterest(toByteString('fitness', true), owner)

        await instance.connect(getDummySigner())
    })

    it('should allow the owner to set the value of satoshis contained', async () => {
        const { tx: callTx, atInputIndex } = await instance.methods.setValue(
            {
                fromUTXO: getDummyUTXO(),
            } as MethodCallOptions<PersonalInterest>
        )

        const result = callTx.verifyScript(atInputIndex)
        expect(result.success, result.error).to.eq(true)
    })

    it('should allow the owner to set the weight of the interest', async () => {
        const { tx: callTx, atInputIndex } = await instance.methods.setWeight(
            5,
            {
                fromUTXO: getDummyUTXO(),
            } as MethodCallOptions<PersonalInterest>
        )

        const result = callTx.verifyScript(atInputIndex)
        expect(result.success, result.error).to.eq(true)
    })

    it('should allow the owner to remove the interest and reclaim the satoshis', async () => {
        const { tx: callTx, atInputIndex } = await instance.methods.remove(
            {
                fromUTXO: getDummyUTXO(),
            } as MethodCallOptions<PersonalInterest>
        )

        const result = callTx.verifyScript(atInputIndex)
        expect(result.success, result.error).to.eq(true)
    })

})
