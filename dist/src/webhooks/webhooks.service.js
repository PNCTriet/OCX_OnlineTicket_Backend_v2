"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const crypto_1 = require("crypto");
const library_1 = require("@prisma/client/runtime/library");
let WebhooksService = WebhooksService_1 = class WebhooksService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WebhooksService_1.name);
    }
    async verifyWebhookSignature(headers, payload, gateway) {
        try {
            const signature = headers['x-signature'] || headers['signature'] || headers['x-webhook-signature'];
            if (!signature) {
                this.logger.warn(`No signature found for ${gateway} webhook`);
                return false;
            }
            const webhookSecret = process.env[`${gateway}_WEBHOOK_SECRET`];
            if (!webhookSecret) {
                this.logger.warn(`No webhook secret configured for ${gateway}`);
                return false;
            }
            const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
            const expectedSignature = (0, crypto_1.createHmac)('sha256', webhookSecret)
                .update(payloadString)
                .digest('hex');
            const isValid = signature === expectedSignature ||
                signature === `sha256=${expectedSignature}`;
            if (!isValid) {
                this.logger.warn(`Invalid signature for ${gateway} webhook`);
            }
            return isValid;
        }
        catch (error) {
            this.logger.error(`Error verifying webhook signature: ${error.message}`);
            return false;
        }
    }
    async processPaymentWebhook(payload, gateway) {
        try {
            const paymentInfo = this.extractPaymentInfo(payload, gateway);
            if (!paymentInfo) {
                throw new common_1.BadRequestException('Invalid payment payload');
            }
            const { orderId, transactionId, amount, status, customerInfo } = paymentInfo;
            const order = await this.prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    payments: true,
                    user: true,
                    order_items: {
                        include: {
                            ticket: true,
                        },
                    },
                },
            });
            if (!order) {
                throw new common_1.NotFoundException(`Order ${orderId} not found`);
            }
            const orderAmount = order.amount;
            const paymentAmount = new library_1.Decimal(amount);
            if (!orderAmount.equals(paymentAmount)) {
                this.logger.warn(`Amount mismatch for order ${orderId}: expected ${orderAmount}, received ${paymentAmount}`);
                throw new common_1.BadRequestException('Payment amount mismatch');
            }
            const payment = await this.prisma.payment.findFirst({
                where: {
                    order_id: orderId,
                    gateway: gateway.toLowerCase(),
                },
            });
            if (!payment) {
                throw new common_1.NotFoundException(`Payment not found for order ${orderId}`);
            }
            const updatedPayment = await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
                    txn_code: transactionId,
                    paid_at: status === 'SUCCESS' ? new Date() : null,
                },
            });
            const orderStatus = status === 'SUCCESS' ? 'COMPLETED' : 'FAILED';
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: orderStatus },
            });
            if (status === 'SUCCESS') {
                await this.sendPaymentConfirmation(order, payment);
                await this.generateAndSendTickets(order);
            }
            await this.prisma.webhookLog.create({
                data: {
                    target_url: `/webhooks/payment/${gateway.toLowerCase()}`,
                    event_type: 'PAYMENT_CONFIRMATION',
                    order_id: orderId,
                    payload: JSON.stringify(payload),
                    status_code: 200,
                    response_text: 'Payment processed successfully',
                },
            });
            return {
                success: true,
                orderId,
                paymentId: payment.id,
                status: orderStatus,
            };
        }
        catch (error) {
            this.logger.error(`Error processing payment webhook: ${error.message}`);
            await this.prisma.webhookLog.create({
                data: {
                    target_url: `/webhooks/payment/${gateway.toLowerCase()}`,
                    event_type: 'PAYMENT_CONFIRMATION',
                    payload: JSON.stringify(payload),
                    status_code: 400,
                    response_text: error.message,
                },
            });
            throw error;
        }
    }
    extractPaymentInfo(payload, gateway) {
        try {
            switch (gateway) {
                case 'VNPAY':
                    return {
                        orderId: parseInt(payload.vnp_TxnRef || payload.orderId),
                        transactionId: payload.vnp_TransactionNo || payload.transactionId,
                        amount: parseInt(payload.vnp_Amount) / 100,
                        status: payload.vnp_ResponseCode === '00' ? 'SUCCESS' : 'FAILED',
                    };
                case 'MOMO':
                    return {
                        orderId: parseInt(payload.orderId),
                        transactionId: payload.transId,
                        amount: payload.amount,
                        status: payload.resultCode === 0 ? 'SUCCESS' : 'FAILED',
                    };
                case 'ZALOPAY':
                    return {
                        orderId: parseInt(payload.orderId),
                        transactionId: payload.transactionId,
                        amount: payload.amount,
                        status: payload.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
                    };
                case 'GENERIC':
                    return {
                        orderId: parseInt(payload.orderId || payload.order_id),
                        transactionId: payload.transactionId || payload.transaction_id || payload.txn_code,
                        amount: payload.amount,
                        status: payload.status || payload.result,
                        customerInfo: payload.customerInfo || payload.customer_info,
                    };
                default:
                    this.logger.warn(`Unknown gateway: ${gateway}`);
                    return null;
            }
        }
        catch (error) {
            this.logger.error(`Error extracting payment info: ${error.message}`);
            return null;
        }
    }
    async sendPaymentConfirmation(order, payment) {
        try {
            await this.prisma.emailLog.create({
                data: {
                    user_id: order.user_id,
                    event_id: order.order_items[0]?.ticket?.event_id,
                    email_type: 'PAYMENT_CONFIRMATION',
                    subject: 'Thanh toán thành công - Xác nhận đơn hàng',
                    status: 'PENDING',
                },
            });
            this.logger.log(`Payment confirmation email queued for order ${order.id}`);
        }
        catch (error) {
            this.logger.error(`Error sending payment confirmation: ${error.message}`);
        }
    }
    async generateAndSendTickets(order) {
        try {
            for (const item of order.order_items) {
                for (let i = 0; i < item.quantity; i++) {
                    const ticketCode = this.generateTicketCode(order.id, item.ticket_id, i + 1);
                    await this.prisma.checkinLog.create({
                        data: {
                            user_id: order.user_id,
                            ticket_id: item.ticket_id,
                            event_id: item.ticket.event_id,
                            checkin_time: new Date(),
                            verified_by: 'SYSTEM',
                        },
                    });
                }
            }
            await this.prisma.emailLog.create({
                data: {
                    user_id: order.user_id,
                    event_id: order.order_items[0]?.ticket?.event_id,
                    email_type: 'TICKET_DELIVERY',
                    subject: 'Vé của bạn đã sẵn sàng',
                    status: 'PENDING',
                },
            });
            this.logger.log(`Tickets generated and sent for order ${order.id}`);
        }
        catch (error) {
            this.logger.error(`Error generating tickets: ${error.message}`);
        }
    }
    generateTicketCode(orderId, ticketId, sequence) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `TKT-${orderId}-${ticketId}-${sequence}-${timestamp}-${random}`.toUpperCase();
    }
    async logWebhook(payload, headers) {
        try {
            await this.prisma.webhookLog.create({
                data: {
                    target_url: '/webhooks/payment/generic',
                    event_type: 'WEBHOOK_RECEIVED',
                    payload: JSON.stringify({ payload, headers }),
                    status_code: 200,
                    response_text: 'Webhook logged for debugging',
                },
            });
        }
        catch (error) {
            this.logger.error(`Error logging webhook: ${error.message}`);
        }
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map