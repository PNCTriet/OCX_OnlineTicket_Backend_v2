import { PrismaService } from '@/common/prisma/prisma.service';
export declare class WebhooksService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    verifyWebhookSignature(headers: any, payload: any, gateway: string): Promise<boolean>;
    processPaymentWebhook(payload: any, gateway: string): Promise<{
        success: boolean;
        orderId?: number;
        paymentId?: number;
        status: string;
    }>;
    private extractPaymentInfo;
    private sendPaymentConfirmation;
    private generateAndSendTickets;
    private generateTicketCode;
    logWebhook(payload: any, headers: any): Promise<void>;
}
