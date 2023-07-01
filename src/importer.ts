
import { BoostPowJob, BoostPowJobProof, bsv, transaction } from "boostpow";
import delay = require("delay");
import { importBoostProofs } from "./boost";
import { log } from "./log";

import models from "./models";

type JobsMap = {
    [key: string]: boolean;
}

class Importer {

    jobs: JobsMap = {};

    async importProof(tx_hex: string): Promise<{job: BoostPowJob, proofs: Record<number,BoostPowJobProof>}> {

        log.info('importer.importProof', { tx_hex })

        const tx = new bsv.Transaction(tx_hex)

        const proofs = transaction.fromTransaction(tx).redemptions;

        if (Object.keys(proofs).length===0) { return }

        const result = await importBoostProofs(proofs, tx_hex)

        log.info('importer.importProof.results', result)

        return { job: undefined, proofs }

    }

    addJob({txid, index} : { txid: string, index: number}): void {
        this.jobs[`${txid}_${index}`] = true
    }

    getJob({txid, index} : { txid: string, index: number}): boolean {

        return !!this.jobs[`${txid}_${index}`]
    }

    removeJob({txid, index} : { txid: string, index: number}): void {

        this.jobs[`${txid}_${index}`] = undefined
    }

    static async loadFromDatabase(): Promise<Importer> {

        const jobs = await models.BoostJob.findAll({

            where: {

                spent: false         
            }
        })

        const importer = new Importer()

        for (let job of jobs) {

            importer.addJob({

                txid: job.txid,

                index: job.vout

            })
        }

        return importer

    }

}

var importer: Importer

var loaded: boolean = false

async function awaitLoaded() {

    while (!loaded) {
        await delay(10)
    }
}

export { importer, awaitLoaded as loaded }

Importer.loadFromDatabase().then(_importer =>  {

    importer = _importer;

    loaded = true

})
.catch(console.error)

