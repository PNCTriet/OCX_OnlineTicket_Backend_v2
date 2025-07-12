import { Decimal } from '@prisma/client/runtime/library';
export declare class CreateOrderDto {
    user_id?: string;
    status: string;
    payment_method: string;
    amount: number;
}
export declare class UpdateOrderDto {
    user_id?: string;
    status?: string;
    payment_method?: string;
    amount?: number;
}
export declare class OrderResponseDto {
    id: number;
    user_id?: string;
    status: string;
    payment_method: string;
    amount: Decimal;
    created_at: Date;
    updated_at: Date;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}
