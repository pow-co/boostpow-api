"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const miner_1 = require("./miner");
let miner = new miner_1.Miner();
const socket_1 = require("./socket");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const channel = yield socket_1.connectChannel();
    miner.mine({
        content: '0xB3E04FAEC739C6A337002AC4015AC9515D4184DC4C7637DE9D390EEBCDF0E0DB',
        difficulty: 0.001
    });
    miner.on('besthash', (payload) => {
        //console.log('besthash', payload)
        channel.push('besthash', payload);
    });
}))();
setInterval(() => {
    //console.log('HASHRATE', miner.getHashrate()) 
}, 10000);
//# sourceMappingURL=main.js.map