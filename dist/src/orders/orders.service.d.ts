import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto, OrderResponseDto } from './dto/order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    purchaseTickets(purchaseDto: {
        items: Array<{
            ticketId: number;
            quantity: number;
        }>;
        paymentMethod: string;
        promoCode?: string;
    }, userId: string): Promise<OrderResponseDto>;
    getUserOrders(userId: string): Promise<OrderResponseDto[]>;
    getUserOrder(orderId: number, userId: string): Promise<OrderResponseDto>;
    getPaymentStatus(orderId: number, userId: string): Promise<{
        orderId: number;
        status: string;
        paymentStatus: string;
        paidAt?: Date;
        transactionCode?: string;
    }>;
    findAll(): Promise<OrderResponseDto[]>;
    count(): Promise<number>;
    findOne(id: number): Promise<OrderResponseDto>;
    create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto>;
    update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto>;
    remove(id: number): Promise<void>;
}
