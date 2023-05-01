"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personalInterest_1 = require("../../src/contracts/personalInterest");
const txHelper_1 = require("./utils/txHelper");
const scrypt_ts_1 = require("scrypt-ts");
const message = 'hello world, sCrypt!';
async function main() {
    await personalInterest_1.PersonalInterest.compile();
    const privKey = scrypt_ts_1.bsv.PrivateKey.fromRandom();
    const owner = (0, scrypt_ts_1.PubKey)(privKey.toPublicKey().toHex());
    const instance = new personalInterest_1.PersonalInterest((0, scrypt_ts_1.sha256)((0, scrypt_ts_1.toByteString)(message, true)), owner);
    // connect to a signer
    await instance.connect((0, txHelper_1.getDefaultSigner)());
    // contract deployment
    const deployTx = await instance.deploy(txHelper_1.inputSatoshis);
    console.log('PersonalInterest contract deployed: ', deployTx.id);
    // contract call
    const { tx: callTx } = await instance.methods.unlock((0, scrypt_ts_1.toByteString)(message, true));
    console.log('PersonalInterest contract `unlock` called: ', callTx.id);
}
describe('Test SmartContract `PersonalInterest` on testnet', () => {
    it('should succeed', async () => {
        await main();
    });
});
//# sourceMappingURL=personalInterest.js.map