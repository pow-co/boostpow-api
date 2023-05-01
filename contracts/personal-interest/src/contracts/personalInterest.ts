import {
    assert,
    ByteString,
    method,
    prop,
    SmartContract,
    Sig,
    PubKey
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
    public setValue(signature: Sig) {

      assert(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`)
    }

    @method()
    public setWeight(weight: bigint, signature: Sig) {

      this.weight = weight

      assert(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`)
    }

    @method()
    public remove(signature: Sig) {

      assert(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`)
    }

}
