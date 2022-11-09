
import models from './src/models'

import { BoostPowJobProof as Proof } from 'boostpow'

async function run() {

  try {

    const proofs = await models.BoostWork.findAll({

    })

    for (let record of proofs) {

      console.log(record.toJSON())

      const proof = Proof.fromRawTransaction(record.tx_hex)

      //const { minerPublicKey, minerPublicKeyHash }  = proof

      //console.log({ minerPublicKey, minerPublicKeyHash })

      console.log(proof)

    }

  } catch(error) {

      console.error('error', error)

  }

}

run()

