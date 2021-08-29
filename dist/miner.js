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
exports.Miner = void 0;
require('dotenv').config();
const { spawn } = require('child_process');
const { EventEmitter } = require('events');
const path_1 = require("path");
const os_1 = require("os");
const bsv = require("bsv");
const os = require("os");
const publicIp = require('public-ip');
function getBoostMiner() {
    switch (os_1.platform()) {
        case 'darwin':
            return path_1.join(__dirname, '../includes/boost_miner_mac');
        case 'linux':
            return path_1.join(__dirname, '../includes/boost_miner_linux');
        case 'win32':
            return path_1.join(__dirname, '../includes/boost_miner_windows');
        default:
            throw new Error(`platform ${os_1.platform()} not yet supported. Please email steven@pow.co for support`);
    }
}
class Miner extends EventEmitter {
    constructor() {
        super(...arguments);
        this.stop = false;
        this.hashrate = 0; // hashes per second
        this._ipv4 = null;
        this._ipv6 = null;
    }
    getHashrate() {
        return this.hashrate;
    }
    get publickey() {
        let privkey = new bsv.PrivKey().fromWif(process.env.MINER_SECRET_KEY_WIF);
        let pubkey = new bsv.PubKey().fromPrivKey(privkey);
        return pubkey.toString();
    }
    getIPv4() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._ipv4) {
                // currently undefined behavior in mainland china
                this._ipv4 = yield publicIp.v4();
            }
            return this._ipv4;
        });
    }
    getIPv6() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._ipv6) {
                this._ipv6 = yield publicIp.v6();
            }
            return this._ipv6;
        });
    }
    setHashrate({ hashes }) {
        let newHashes = hashes - this.besthashes;
        let duration = (new Date().getTime() - this.besthashtime) / 1000;
        let hashrate = newHashes / duration;
        this.hashrate = hashrate;
        this.besthashtime = new Date().getTime();
        this.emit('hashrate', {
            hashrate: this.hashrate,
            publickey: this.publickey,
            ipv4: this._ipv4,
            content: this.content,
            difficulty: this.difficulty
        });
    }
    mine(params) {
        this.hashrate = 0;
        this.besthashes = 0;
        this.besthashtime = new Date().getTime();
        this.content = params.content;
        this.difficulty = params.difficulty || 0.001;
        const ls = spawn(getBoostMiner(), [`--content=${this.content}`, `--difficulty=${this.difficulty}`], {
            env: {
                'MINER_SECRET_KEY_WIF': process.env.MINER_SECRET_KEY_WIF
            }
        });
        ls.stdout.on('data', (data) => __awaiter(this, void 0, void 0, function* () {
            let content = data.toString();
            if (content.match(/^hashes/)) {
                let [hashes, besthash] = data.toString().split("\n").map(line => {
                    let parts = line.split(':');
                    return parts[parts.length - 1].trim();
                });
                this.emit('besthash', {
                    hashes,
                    besthash,
                    content: this.content,
                    difficulty: this.difficulty,
                    publickey: this.publickey,
                    os: {
                        arch: os.arch(),
                        cpus: os.cpus(),
                        platform: os.platform(),
                        network: os.networkInterfaces()
                    },
                    ipv4: yield this.getIPv4()
                });
                this.setHashrate({ hashes });
            }
            else if (content.match(/^solution/)) {
                let solution = content.split(' ')[1].trim().replace('"', "");
                this.emit('solution', {
                    content: this.content,
                    difficulty: this.difficulty,
                    publickey: this.publickey,
                    solution,
                    os: {
                        arch: os.arch(),
                        cpus: os.cpus(),
                        platform: os.platform(),
                        network: os.networkInterfaces()
                    },
                    ipv4: yield this.getIPv4()
                });
            }
            else {
            }
        }));
        ls.stderr.on('data', (data) => {
            this.emit('error', data);
            if (!this.stop) {
                this.mine({ content: this.content });
            }
        });
        ls.on('close', (code) => {
            this.emit('complete', code);
            if (!this.stop) {
                this.mine({ content: this.content });
            }
        });
    }
}
exports.Miner = Miner;
//# sourceMappingURL=miner.js.map