import {
    method,
    prop,
    SmartContract,
    assert,
    PubKeyHash,
    Sig,
    PubKey,
    hash160,
    bsv
} from 'scrypt-ts'

export class Lockup extends SmartContract {
    @prop()
    lockUntilHeight: bigint

    @prop()
    pkhash: PubKeyHash

    constructor(pkhash: PubKeyHash, lockUntilHeight: bigint) {
        super(...arguments)
        assert(lockUntilHeight < 500000000, 'must use blockHeight locktime')
        this.lockUntilHeight = lockUntilHeight
        this.pkhash = pkhash
    }

    @method()
    public redeem(sig: Sig, pubkey: PubKey) {
        assert(this.ctx.locktime < 500000000, 'must use blockHeight locktime')
        assert(this.ctx.sequence < 0xffffffff, 'must use sequence locktime')
        assert(
            this.ctx.locktime >= this.lockUntilHeight,
            'lockUntilHeight not reached'
        )
        assert(
            hash160(pubkey) == this.pkhash,
            'public key hashes are not equal'
        )
        // Check signature validity.
        assert(this.checkSig(sig, pubkey), 'signature check failed')
    }
}

let initialized = false

export async function init(){

    if (initialized) { return }

    await Lockup.compile()

    initialized = true

}

export async function detectLockupFromTxHex(txhex:string): Promise<[Lockup | null,number]> {

    await init()

    let lockup = null
    let vout = 0

    const tx = new bsv.Transaction(txhex)

    for (let i = 0; i < tx.outputs.length; i++) {

        try {
            
            lockup = Lockup.fromTx(tx,i)
            vout = i

            break
            
        } catch (error) {
            
            console.log(error)
        }

    }

    return [lockup,vout]
}
