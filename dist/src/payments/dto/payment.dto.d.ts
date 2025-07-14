export declare class CreatePaymentDto {
    order_id: number;
    gateway: string;
    status: string;
    txn_code?: string;
    paid_at?: string;
}
export declare class UpdatePaymentDto {
    gateway?: string;
    status?: string;
    txn_code?: string;
    paid_at?: string;
}
export declare class PaymentResponseDto {
    id: number;
    order_id: number;
    gateway: string;
    status: string;
    txn_code: string;
    paid_at: Date;
    created_at: Date;
    updated_at: Date;
    order?: any;
}
