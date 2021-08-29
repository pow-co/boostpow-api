require('dotenv').config()

const { spawn } = require('child_process');

const {EventEmitter} = require('events')

import { log } from './log'

import { join } from 'path'

import { platform } from 'os'

import * as bsv from 'bsv'

import * as os from 'os'

const publicIp = require('public-ip');

function getBoostMiner(): string {

  switch(platform()) {
    case 'darwin':
      return join(__dirname, '../includes/boost_miner_mac')
    case 'linux':
      return join(__dirname, '../includes/boost_miner_linux')
    case 'win32':
      return join(__dirname, '../includes/boost_miner_windows')
    default: 
      throw new Error(`platform ${platform()} not yet supported. Please email steven@pow.co for support`)
  }

}

interface MiningParams {
  content: string;
  difficulty?: number;
}

export class Miner extends EventEmitter {

  stop = false

  hashrate = 0 // hashes per second

  _ipv4 = null
  _ipv6 = null

  getHashrate() {

    return this.hashrate
  }

  get publickey() {
    let privkey = new bsv.PrivKey().fromWif(process.env.MINER_SECRET_KEY_WIF) 
    let pubkey = new bsv.PubKey().fromPrivKey(privkey)
    return pubkey.toString()
  }

  async getIPv4() {
    if (!this._ipv4) {
      // currently undefined behavior in mainland china
      this._ipv4 = await publicIp.v4()
    }
    return this._ipv4
  }

  async getIPv6() {
    if (!this._ipv6) {
      this._ipv6 = await publicIp.v6()
    }
    return this._ipv6
  }

  setHashrate({ hashes }) {

    let newHashes = hashes - this.besthashes

    let duration = (new Date().getTime() - this.besthashtime) / 1000

    let hashrate = newHashes / duration

    this.hashrate = hashrate

    this.besthashtime = new Date().getTime()

    this.emit('hashrate', {
      hashrate: this.hashrate,
      publickey: this.publickey,
      ipv4: this._ipv4,
      content: this.content,
      difficulty: this.difficulty
    })
    
  }

  mine(params: MiningParams) {

    this.hashrate = 0
    this.besthashes = 0
    this.besthashtime = new Date().getTime()
    this.content = params.content
    this.difficulty = params.difficulty || 0.001

    const ls = spawn(getBoostMiner(), [`--content=${this.content}`, `--difficulty=${this.difficulty}`], {
      env: {
        'MINER_SECRET_KEY_WIF': process.env.MINER_SECRET_KEY_WIF
      }
    });

    ls.stdout.on('data', async (data) => {
      let content = data.toString() 

      if (content.match(/^hashes/)) {

        let [ hashes, besthash ] = data.toString().split("\n").map(line => {
          let parts = line.split(':')
          return parts[parts.length - 1].trim()
        })

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
          ipv4: await this.getIPv4()
        })

        this.setHashrate({ hashes })

      } else if (content.match(/^solution/)) {

        let solution = content.split(' ')[1].trim().replace('"', "")

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
          ipv4: await this.getIPv4()
        })

      } else {
      }

    });

    ls.stderr.on('data', (data) => {
      this.emit('error', data)
      if (!this.stop) {
        this.mine({ content: this.content })
      }
    });

    ls.on('close', (code) => {
      this.emit('complete', code)
      if (!this.stop) {
        this.mine({ content: this.content })
      }
    });

  }
}

