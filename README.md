
# Proof of Work

CPU Miner for Generating Expensive Hashes of Content

## Installation

```
npm install --save proofofwork
```

## Usage

```
import { Miner } from 'proofofwork'


let miner = new Miner()

miner.mine({
  content: '0xB3E04FAEC739C6A337002AC4015AC9515D4184DC4C7637DE9D390EEBCDF0E0DB',
  difficulty: 0.001
})

```
