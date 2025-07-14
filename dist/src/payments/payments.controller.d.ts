import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentResponseDto } from './dto/payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(req: any): Promise<PaymentResponseDto[]>;
    getRevenue(req: any): Promise<number>;
    debugRevenue(req: any): Promise<any>;
    getRevenueByPeriod(period: string, req: any): Promise<{
        data: {
            label: string;
            value: number;
        }[];
    }>;
    getCount(req: any): Promise<number>;
    findById(id: string): Promise<PaymentResponseDto>;
    create(createPaymentDto: CreatePaymentDto, req: any): Promise<PaymentResponseDto>;
    update(id: string, updatePaymentDto: UpdatePaymentDto, req: any): Promise<PaymentResponseDto>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
}
