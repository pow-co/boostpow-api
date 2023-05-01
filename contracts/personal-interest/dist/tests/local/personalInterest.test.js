"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const scrypt_ts_1 = require("scrypt-ts");
const personalInterest_1 = require("../../src/contracts/personalInterest");
const txHelper_1 = require("./utils/txHelper");
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
(0, chai_1.use)(chai_as_promised_1.default);
describe('Test SmartContract `PersonalInterest`', () => {
    let instance;
    before(async () => {
        await personalInterest_1.PersonalInterest.compile();
        const signer = (0, txHelper_1.getDummySigner)();
        console.log(signer);
        const privKey = scrypt_ts_1.bsv.PrivateKey.fromRandom();
        const owner = (0, scrypt_ts_1.PubKey)(privKey.toPublicKey().toHex());
        instance = new personalInterest_1.PersonalInterest((0, scrypt_ts_1.toByteString)('fitness', true), owner);
        await instance.connect((0, txHelper_1.getDummySigner)());
    });
    it('should allow the owner to set the value of satoshis contained', async () => {
        const { tx: callTx, atInputIndex } = await instance.methods.setValue({
            fromUTXO: (0, txHelper_1.getDummyUTXO)(),
        });
        const result = callTx.verifyScript(atInputIndex);
        (0, chai_1.expect)(result.success, result.error).to.eq(true);
    });
    it('should allow the owner to set the weight of the interest', async () => {
        const { tx: callTx, atInputIndex } = await instance.methods.setWeight(5, {
            fromUTXO: (0, txHelper_1.getDummyUTXO)(),
        });
        const result = callTx.verifyScript(atInputIndex);
        (0, chai_1.expect)(result.success, result.error).to.eq(true);
    });
    it('should allow the owner to remove the interest and reclaim the satoshis', async () => {
        const { tx: callTx, atInputIndex } = await instance.methods.remove({
            fromUTXO: (0, txHelper_1.getDummyUTXO)(),
        });
        const result = callTx.verifyScript(atInputIndex);
        (0, chai_1.expect)(result.success, result.error).to.eq(true);
    });
});
//# sourceMappingURL=personalInterest.test.js.map