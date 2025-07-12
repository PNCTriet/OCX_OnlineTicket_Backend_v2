import { Controller, Post, Body, Headers, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';

@ApiTags('🔗 Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('payment/vnpay')
  @ApiOperation({ summary: 'Webhook xác nhận thanh toán VNPAY' })
  @ApiResponse({ status: 200, description: 'Xử lý webhook thành công' })
  async handleVNPayWebhook(
    @Body() payload: any,
    @Headers() headers: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Verify webhook signature
      const isValid = await this.webhooksService.verifyWebhookSignature(
        headers,
        payload,
        'VNPAY'
      );

      if (!isValid) {
        throw new HttpException('Invalid webhook signature', HttpStatus.BAD_REQUEST);
      }

      // Process payment confirmation
      const result = await this.webhooksService.processPaymentWebhook(payload, 'VNPAY');
      
      return {
        success: true,
        message: 'Payment webhook processed successfully'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Webhook processing failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('payment/momo')
  @ApiOperation({ summary: 'Webhook xác nhận thanh toán MOMO' })
  @ApiResponse({ status: 200, description: 'Xử lý webhook thành công' })
  async handleMomoWebhook(
    @Body() payload: any,
    @Headers() headers: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      const isValid = await this.webhooksService.verifyWebhookSignature(
        headers,
        payload,
        'MOMO'
      );

      if (!isValid) {
        throw new HttpException('Invalid webhook signature', HttpStatus.BAD_REQUEST);
      }

      const result = await this.webhooksService.processPaymentWebhook(payload, 'MOMO');
      
      return {
        success: true,
        message: 'Payment webhook processed successfully'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Webhook processing failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('payment/zalopay')
  @ApiOperation({ summary: 'Webhook xác nhận thanh toán ZaloPay' })
  @ApiResponse({ status: 200, description: 'Xử lý webhook thành công' })
  async handleZaloPayWebhook(
    @Body() payload: any,
    @Headers() headers: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      const isValid = await this.webhooksService.verifyWebhookSignature(
        headers,
        payload,
        'ZALOPAY'
      );

      if (!isValid) {
        throw new HttpException('Invalid webhook signature', HttpStatus.BAD_REQUEST);
      }

      const result = await this.webhooksService.processPaymentWebhook(payload, 'ZALOPAY');
      
      return {
        success: true,
        message: 'Payment webhook processed successfully'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Webhook processing failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('payment/generic')
  @ApiOperation({ summary: 'Webhook xác nhận thanh toán generic' })
  @ApiResponse({ status: 200, description: 'Xử lý webhook thành công' })
  async handleGenericWebhook(
    @Body() payload: any,
    @Headers() headers: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Log webhook for debugging
      await this.webhooksService.logWebhook(payload, headers);
      
      const result = await this.webhooksService.processPaymentWebhook(payload, 'GENERIC');
      
      return {
        success: true,
        message: 'Payment webhook processed successfully'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Webhook processing failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }
} 