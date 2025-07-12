import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { createHmac } from 'crypto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Verify webhook signature from payment gateway
   */
  async verifyWebhookSignature(
    headers: any,
    payload: any,
    gateway: string
  ): Promise<boolean> {
    try {
      const signature = headers['x-signature'] || headers['signature'] || headers['x-webhook-signature'];
      
      if (!signature) {
        this.logger.warn(`No signature found for ${gateway} webhook`);
        return false;
      }

      // Get webhook secret from environment
      const webhookSecret = process.env[`${gateway}_WEBHOOK_SECRET`];
      
      if (!webhookSecret) {
        this.logger.warn(`No webhook secret configured for ${gateway}`);
        return false;
      }

      // Create expected signature
      const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const expectedSignature = createHmac('sha256', webhookSecret)
        .update(payloadString)
        .digest('hex');

      const isValid = signature === expectedSignature || 
                     signature === `sha256=${expectedSignature}`;

      if (!isValid) {
        this.logger.warn(`Invalid signature for ${gateway} webhook`);
      }

      return isValid;
    } catch (error) {
      this.logger.error(`Error verifying webhook signature: ${error.message}`);
      return false;
    }
  }

  /**
   * Process payment webhook and update order status
   */
  async processPaymentWebhook(payload: any, gateway: string): Promise<{
    success: boolean;
    orderId?: number;
    paymentId?: number;
    status: string;
  }> {
    try {
      // Extract payment information from payload
      const paymentInfo = this.extractPaymentInfo(payload, gateway);
      
      if (!paymentInfo) {
        throw new BadRequestException('Invalid payment payload');
      }

      const { orderId, transactionId, amount, status, customerInfo } = paymentInfo;

      // Find the order
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
        throw new NotFoundException(`Order ${orderId} not found`);
      }

      // Check if payment amount matches order amount
      const orderAmount = order.amount;
      const paymentAmount = new Decimal(amount);
      
      if (!orderAmount.equals(paymentAmount)) {
        this.logger.warn(`Amount mismatch for order ${orderId}: expected ${orderAmount}, received ${paymentAmount}`);
        throw new BadRequestException('Payment amount mismatch');
      }

      // Update payment status - find by order_id and gateway
      const payment = await this.prisma.payment.findFirst({
        where: { 
          order_id: orderId,
          gateway: gateway.toLowerCase(),
        },
      });

      if (!payment) {
        throw new NotFoundException(`Payment not found for order ${orderId}`);
      }

      const updatedPayment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
          txn_code: transactionId,
          paid_at: status === 'SUCCESS' ? new Date() : null,
        },
      });

      // Update order status
      const orderStatus = status === 'SUCCESS' ? 'COMPLETED' : 'FAILED';
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: orderStatus },
      });

      // If payment successful, send confirmation email and tickets
      if (status === 'SUCCESS') {
        await this.sendPaymentConfirmation(order, payment);
        await this.generateAndSendTickets(order);
      }

      // Log webhook processing
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

    } catch (error) {
      this.logger.error(`Error processing payment webhook: ${error.message}`);
      
      // Log failed webhook
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

  /**
   * Extract payment information from different gateway payloads
   */
  private extractPaymentInfo(payload: any, gateway: string): {
    orderId: number;
    transactionId: string;
    amount: number;
    status: string;
    customerInfo?: any;
  } | null {
    try {
      switch (gateway) {
        case 'VNPAY':
          return {
            orderId: parseInt(payload.vnp_TxnRef || payload.orderId),
            transactionId: payload.vnp_TransactionNo || payload.transactionId,
            amount: parseInt(payload.vnp_Amount) / 100, // VNPAY amount in cents
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
          // Generic format - expect standard fields
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
    } catch (error) {
      this.logger.error(`Error extracting payment info: ${error.message}`);
      return null;
    }
  }

  /**
   * Send payment confirmation email
   */
  private async sendPaymentConfirmation(order: any, payment: any): Promise<void> {
    try {
      // Create email log
      await this.prisma.emailLog.create({
        data: {
          user_id: order.user_id,
          event_id: order.order_items[0]?.ticket?.event_id,
          email_type: 'PAYMENT_CONFIRMATION',
          subject: 'Thanh toán thành công - Xác nhận đơn hàng',
          status: 'PENDING',
        },
      });

      // TODO: Implement actual email sending logic
      this.logger.log(`Payment confirmation email queued for order ${order.id}`);
    } catch (error) {
      this.logger.error(`Error sending payment confirmation: ${error.message}`);
    }
  }

  /**
   * Generate and send tickets to customer
   */
  private async generateAndSendTickets(order: any): Promise<void> {
    try {
      // Generate ticket codes for each order item
      for (const item of order.order_items) {
        for (let i = 0; i < item.quantity; i++) {
          const ticketCode = this.generateTicketCode(order.id, item.ticket_id, i + 1);
          
          // Create checkin log entry for each ticket
          await this.prisma.checkinLog.create({
            data: {
              user_id: order.user_id,
              ticket_id: item.ticket_id,
              event_id: item.ticket.event_id,
              checkin_time: new Date(), // Set current time as checkin time
              verified_by: 'SYSTEM', // Mark as verified by system
            },
          });
        }
      }

      // Send tickets email
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
    } catch (error) {
      this.logger.error(`Error generating tickets: ${error.message}`);
    }
  }

  /**
   * Generate unique ticket code
   */
  private generateTicketCode(orderId: number, ticketId: number, sequence: number): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TKT-${orderId}-${ticketId}-${sequence}-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Log webhook for debugging
   */
  async logWebhook(payload: any, headers: any): Promise<void> {
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
    } catch (error) {
      this.logger.error(`Error logging webhook: ${error.message}`);
    }
  }
} 