import { PrismaService } from '@/common/prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentResponseDto } from './dto/payment.dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(currentUser: any): Promise<PaymentResponseDto[]>;
    getCount(currentUser: any): Promise<number>;
    getRevenue(currentUser: any): Promise<number>;
    getRevenueByPeriod(period: string, currentUser: any): Promise<{
        data: {
            label: string;
            value: number;
        }[];
    }>;
    private formatLabel;
    debugRevenue(currentUser: any): Promise<any>;
    findById(id: number): Promise<PaymentResponseDto>;
    create(createPaymentDto: CreatePaymentDto, currentUser: any): Promise<PaymentResponseDto>;
    update(id: number, updatePaymentDto: UpdatePaymentDto, currentUser: any): Promise<PaymentResponseDto>;
    delete(id: number, currentUser: any): Promise<{
        message: string;
    }>;
}
