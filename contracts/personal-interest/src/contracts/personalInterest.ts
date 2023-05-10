import {
    assert,
    ByteString,
    method,
    prop,
    SmartContract,
    Sig,
    PubKey,
    hash256
} from 'scrypt-ts'

export class PersonalInterest extends SmartContract {
    @prop()
    owner: PubKey

    @prop()
    topic: ByteString

    @prop(true)
    weight: bigint

    constructor(topic: ByteString, owner: PubKey, weight: bigint = 1n) {
        super(...arguments)
        this.topic = topic
        this.owner = owner
        this.weight = weight
    }

    @method()
    public setWeight(weight: bigint, signature: Sig) {

      assert(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`)

      this.weight = weight

      // Ensure Contract State Remains Locked With Exact Satoshis Value
      const amount: bigint = this.ctx.utxo.value
      let outputs: ByteString = this.buildStateOutput(amount)
      if (this.changeAmount > 0n) {
        outputs += this.buildChangeOutput()
      }
      assert(this.ctx.hashOutputs == hash256(outputs), 'hashOutputs mismatch')
    }

    @method()
    public remove(signature: Sig) {
      // No assertion that the state out remains the same. By calling remove() you essentially
      // destroy the smart contract and may reclaim all the satoshis

      assert(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`)
    }

}
