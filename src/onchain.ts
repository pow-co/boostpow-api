
export interface OnchainTransaction {
    tx_id: string;
    tx_index: number;
    app_id: string;
    key: string;
    value: any;
    nonce?: string;
    author?: string;
    signature?: string;
    source?: string;
    timestamp?: Date;
}