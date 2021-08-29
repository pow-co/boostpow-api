"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miner = void 0;
require('dotenv').config();
const { spawn } = require('child_process');
const { EventEmitter } = require('events');
const path_1 = require("path");
const os_1 = require("os");
const bsv = require("bsv");
const os = require("os");
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
    }
    getHashrate() {
        return this.hashrate;
    }
    get publickey() {
        let privkey = new bsv.PrivKey().fromWif(process.env.MINER_SECRET_KEY_WIF);
        let pubkey = new bsv.PubKey().fromPrivKey(privkey);
        return pubkey.toString();
    }
    setHashrate({ hashes }) {
        let newHashes = hashes - this.besthashes;
        let duration = (new Date().getTime() - this.besthashtime) / 1000;
        let hashrate = newHashes / duration;
        this.hashrate = hashrate;
        this.besthashtime = new Date().getTime();
    }
    resetHashrate() {
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
        ls.stdout.on('data', (data) => {
            //console.log(data)
            let content = data.toString();
            //console.log('CONTENT', content)
            if (content.match(/^ hashes/)) {
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
                    }
                });
                this.setHashrate({ hashes });
            }
            else if (content.match(/^Here is the redeem script/)) {
                console.log('REDEEM', content);
            }
            else {
                console.log(content);
            }
        });
        ls.stderr.on('data', (data) => {
            //console.log('ERRCONTENT', data)
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
function getHashrate() {
    /*
     * The hashrate or hashes per second starts at zero and can be computed theoretically every second but
     * given the existing boost cpu miner it can only be calculated every time there is a new best hash.
     *
     * Whenever there is a new best hash we take the current timestamp and the timestamp of the last best
     * hash to determine the time that has expired. Then we take the number of hashes for the current best
     * hash versus the number of hashes on the latest best hash.
     *
     * Whenever a job is complete the timer has to restart unfortunately, but theoretically the rate will
     * be the same.
     *
     */
}
//# sourceMappingURL=miner.js.map