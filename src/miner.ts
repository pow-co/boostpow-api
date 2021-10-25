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
      //return `/Users/zyler/github/ProofOfWorkCompany/BoostMiner/BoostMiner`
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
  txid: string;
  script: string;
  vout: number;
  value: number;
  address: string;
  difficulty?: number;
  wif: string;
  content?: string;
}

export class Miner extends EventEmitter {

  _stop = false

  hashrate = 0 // hashes per second

  _ipv4 = null
  _ipv6 = null

  getHashrate() {

    return this.hashrate
  }

  stop() {
    this._stop = true
  }

  get publickey() {
    let privkey = new bsv.PrivateKey(process.env.MINER_SECRET_KEY_WIF) 
    let pubkey = privkey.publicKey
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
    return new Promise((resolve, reject) => {

      this.miningParams = params;

      this.hashrate = 0
      this.besthashes = 0
      this.besthashtime = new Date().getTime()
      this.content = params.content
      this.difficulty = params.difficulty || 0.001

      log.info('miner.start', params)

      const p = [
        'redeem',
        params.script,
        params.value,
        `0x${params.txid}`,
        params.vout,
        params.wif,
        params.address
      ]

      console.log(p.join(" "))

      const ls = spawn(getBoostMiner(), p, {
      });

      ls.stdout.on('data', async (data) => {

        try {

          let content = data.toString() 

          console.log(content)

          let json = JSON.parse(content)

          console.log(json)

          this.emit(json.event, json);
          console.log("EVENT", json.event)
           
          switch (json.event) {
            case 'job.complete.redeemscript':
              this.emit('job.complete.redeemscript', json)
              //resolve(json)
              break;

            case 'job.complete.transaction':
              //console.log(json)
              console.log('JOB COMPLETE')
              this.emit('job.complete.transaction', json)
              return resolve(json)
            default:
              this.emit(json.event, json);
              break;
          }

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

        } catch(error) {

          console.error(error)

        }

      });

      ls.stderr.on('data', (data) => {
        console.log('ERROR', data)
        this.emit('error', data)
        if (!this._stop) {
          this.mine(this.miningParams)
        }
      });

      ls.on('close', (code) => {
        this.emit('complete', code)
        this._stop = true
        if (!this._stop) {
          this.mine(params)
        }
        //resolve({ code })
      });


    })
  }
}

