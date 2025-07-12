import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto, OrderResponseDto } from './dto/order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    purchaseTickets(purchaseDto: {
        items: Array<{
            ticketId: number;
            quantity: number;
        }>;
        paymentMethod: string;
        promoCode?: string;
    }, req: any): Promise<OrderResponseDto>;
    getMyOrders(req: any): Promise<OrderResponseDto[]>;
    getMyOrder(id: string, req: any): Promise<OrderResponseDto>;
    getPaymentStatus(id: string, req: any): Promise<{
        orderId: number;
        status: string;
        paymentStatus: string;
        paidAt?: Date;
        transactionCode?: string;
    }>;
    findAll(): Promise<OrderResponseDto[]>;
    count(): Promise<{
        count: number;
    }>;
    findOne(id: string): Promise<OrderResponseDto>;
    create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
