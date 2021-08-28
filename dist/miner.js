"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miner = void 0;
require('dotenv').config();
const { spawn } = require('child_process');
const { EventEmitter } = require('events');
const log_1 = require("./log");
const path_1 = require("path");
const os_1 = require("os");
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
    }
    mine(params) {
        const ls = spawn(getBoostMiner(), [`--content=${params.content}`, `--difficulty=${params.difficulty || 0.001}`], {
            env: {
                'MINER_SECRET_KEY_WIF': process.env.MINER_SECRET_KEY_WIF
            }
        });
        ls.stdout.on('data', (data) => {
            let content = data.toString();
            if (content.match(/^ hashes/)) {
                let [hashes, besthash] = data.toString().split("\n").map(line => {
                    let parts = line.split(':');
                    return parts[parts.length - 1];
                });
                log_1.log.info({
                    event: 'besthash',
                    hashes,
                    besthash
                });
            }
            else {
                console.log(content);
            }
        });
        ls.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            if (!this.stop) {
                this.mine({ content: this.content });
            }
        });
        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (!this.stop) {
                this.mine({ content: this.content });
            }
        });
    }
}
exports.Miner = Miner;
//# sourceMappingURL=miner.js.map