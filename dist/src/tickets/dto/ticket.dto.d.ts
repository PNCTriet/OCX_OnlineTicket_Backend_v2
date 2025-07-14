import { Decimal } from '@prisma/client/runtime/library';
export declare class CreateTicketDto {
    event_id: number;
    name: string;
    price: number;
    type: string;
    total: number;
    sold?: number;
    start_sale_date?: string;
    end_sale_date?: string;
    is_active?: boolean;
}
export declare class UpdateTicketDto {
    name?: string;
    price?: number;
    type?: string;
    total?: number;
    sold?: number;
    start_sale_date?: string;
    end_sale_date?: string;
    is_active?: boolean;
}
export declare class TicketResponseDto {
    id: number;
    event_id: number;
    name: string;
    price: Decimal;
    type: string;
    total: number;
    sold: number;
    start_sale_date: Date;
    end_sale_date: Date;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    event?: any;
}
