require('dotenv').config()

const { spawn } = require('child_process');

const {EventEmitter} = require('events')

import { log } from './log'

import { join } from 'path'

import { platform } from 'os'

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

  mine(params: MiningParams) {

    const ls = spawn(getBoostMiner(), [`--content=${params.content}`, `--difficulty=${params.difficulty || 0.001}`], {
      env: {
        'MINER_SECRET_KEY_WIF': process.env.MINER_SECRET_KEY_WIF
      }
    });

    ls.stdout.on('data', (data) => {
      let content = data.toString() 

      if (content.match(/^ hashes/)) {

        let [ hashes, besthash ] = data.toString().split("\n").map(line => {
          let parts = line.split(':')
          return parts[parts.length - 1]
        })

        log.info({
          event: 'besthash',
          hashes,
          besthash
        })

      } else {
        console.log(content)
      }


    });

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      if (!this.stop) {
        this.mine({ content: this.content })
      }
    });

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      if (!this.stop) {
        this.mine({ content: this.content })
      }
    });

  }
}

