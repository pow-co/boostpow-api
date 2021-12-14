#!/usr/bin/env ts-node

import * as program from 'commander'


import { txoFromTxid } from '../txo'

program
  .command('txid_to_txo <txid>')
  .action(async (txid) => {

    try {

      let txo = await txoFromTxid(txid)

      console.log(txo)

    } catch(error) {

      console.error(error)

    }


  })

program
  .parse(process.argv)
