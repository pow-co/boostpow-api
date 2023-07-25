
import { log } from './log'

export interface Script {
    hash: string;
    index: number;
}

export interface Output {}

export interface GetSpendingTransactionResult {
    input: Script;
    output: Script;
}

export async function getSpendingTransaction(output: Script): Promise<GetSpendingTransactionResult | null> {

}
