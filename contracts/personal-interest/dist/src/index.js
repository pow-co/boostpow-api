#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectInterestsFromTxHex = exports.detectInterestsFromTxid = exports.main = exports.init = exports.PersonalInterest = void 0;
const personalInterest_1 = require("./contracts/personalInterest");
Object.defineProperty(exports, "PersonalInterest", { enumerable: true, get: function () { return personalInterest_1.PersonalInterest; } });
const scrypt_ts_1 = require("scrypt-ts");
const Run = require('run-sdk');
const blockchain = new Run.plugins.WhatsOnChain({ network: 'main' });
const txid = 'b0704b4e1e6c6f69f83a430c9d76c564a616e06b163f7eceb78f4a1ed9ebdd30';
let initialized = false;
async function init() {
    if (initialized) {
        return;
    }
    await personalInterest_1.PersonalInterest.compile();
    initialized = true;
}
exports.init = init;
async function main() {
    await init();
    let [interests, txhex] = await detectInterestsFromTxid(txid);
    const tx = new scrypt_ts_1.bsv.Transaction(txhex);
    console.log(interests, 'interests');
    for (let interest of interests) {
        console.log({
            txid,
            //@ts-ignore
            outputIndex: interest.from.outputIndex,
            topic: Buffer.from(interest.topic, 'hex').toString('utf8'),
            owner: new scrypt_ts_1.bsv.PublicKey(interest.owner).toAddress().toString(),
            weight: Number(interest.weight),
            //@ts-ignore
            value: tx.outputs[interest.from.outputIndex].satoshis
        });
    }
}
exports.main = main;
async function detectInterestsFromTxid(txid) {
    await init();
    const hex = await blockchain.fetch(txid);
    const interests = await detectInterestsFromTxHex(hex);
    return [interests, hex];
}
exports.detectInterestsFromTxid = detectInterestsFromTxid;
async function detectInterestsFromTxHex(txhex) {
    await init();
    const interests = [];
    const tx = new scrypt_ts_1.bsv.Transaction(txhex);
    for (let i = 0; i < tx.outputs.length; i++) {
        try {
            //@ts-ignore
            const interest = personalInterest_1.PersonalInterest.fromTx(tx, i);
            interests.push(interest);
        }
        catch (error) {
        }
    }
    return interests;
}
exports.detectInterestsFromTxHex = detectInterestsFromTxHex;
if (require.main === module) {
    main();
}
//# sourceMappingURL=index.js.map