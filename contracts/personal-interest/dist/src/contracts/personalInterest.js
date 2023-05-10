"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalInterest = void 0;
const scrypt_ts_1 = require("scrypt-ts");
class PersonalInterest extends scrypt_ts_1.SmartContract {
    constructor(topic, owner, weight = 1n) {
        super(...arguments);
        this.topic = topic;
        this.owner = owner;
        this.weight = weight;
    }
    setWeight(weight, signature) {
        (0, scrypt_ts_1.assert)(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`);
        this.weight = weight;
        // Ensure Contract State Remains Locked With Exact Satoshis Value
        const amount = this.ctx.utxo.value;
        let outputs = this.buildStateOutput(amount);
        if (this.changeAmount > 0n) {
            outputs += this.buildChangeOutput();
        }
        (0, scrypt_ts_1.assert)(this.ctx.hashOutputs == (0, scrypt_ts_1.hash256)(outputs), 'hashOutputs mismatch');
    }
    remove(signature) {
        // No assertion that the state out remains the same. By calling remove() you essentially
        // destroy the smart contract and may reclaim all the satoshis
        (0, scrypt_ts_1.assert)(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`);
    }
}
__decorate([
    (0, scrypt_ts_1.prop)()
], PersonalInterest.prototype, "owner", void 0);
__decorate([
    (0, scrypt_ts_1.prop)()
], PersonalInterest.prototype, "topic", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(true)
], PersonalInterest.prototype, "weight", void 0);
__decorate([
    (0, scrypt_ts_1.method)()
], PersonalInterest.prototype, "setWeight", null);
__decorate([
    (0, scrypt_ts_1.method)()
], PersonalInterest.prototype, "remove", null);
exports.PersonalInterest = PersonalInterest;
//# sourceMappingURL=personalInterest.js.map