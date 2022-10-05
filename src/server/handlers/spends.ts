
import { getSpendingTransaction } from "../../../find_spending_tx"

export async function show(req, h) {

    const { output_txid, output_index } = req.params

    const output = {
        hash: output_txid,
        index: output_index
    }

    const result = await getSpendingTransaction(output)

    if (result) {

        return Object.assign({ spent: true }, result)

    } else {

        return {
            
            spent: false,

            output
        }

    }

}