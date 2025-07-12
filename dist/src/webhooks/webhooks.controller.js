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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const webhooks_service_1 = require("./webhooks.service");
let WebhooksController = class WebhooksController {
    constructor(webhooksService) {
        this.webhooksService = webhooksService;
    }
    async handleVNPayWebhook(payload, headers) {
        try {
            const isValid = await this.webhooksService.verifyWebhookSignature(headers, payload, 'VNPAY');
            if (!isValid) {
                throw new common_1.HttpException('Invalid webhook signature', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.webhooksService.processPaymentWebhook(payload, 'VNPAY');
            return {
                success: true,
                message: 'Payment webhook processed successfully'
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Webhook processing failed', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async handleMomoWebhook(payload, headers) {
        try {
            const isValid = await this.webhooksService.verifyWebhookSignature(headers, payload, 'MOMO');
            if (!isValid) {
                throw new common_1.HttpException('Invalid webhook signature', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.webhooksService.processPaymentWebhook(payload, 'MOMO');
            return {
                success: true,
                message: 'Payment webhook processed successfully'
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Webhook processing failed', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async handleZaloPayWebhook(payload, headers) {
        try {
            const isValid = await this.webhooksService.verifyWebhookSignature(headers, payload, 'ZALOPAY');
            if (!isValid) {
                throw new common_1.HttpException('Invalid webhook signature', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.webhooksService.processPaymentWebhook(payload, 'ZALOPAY');
            return {
                success: true,
                message: 'Payment webhook processed successfully'
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Webhook processing failed', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async handleGenericWebhook(payload, headers) {
        try {
            await this.webhooksService.logWebhook(payload, headers);
            const result = await this.webhooksService.processPaymentWebhook(payload, 'GENERIC');
            return {
                success: true,
                message: 'Payment webhook processed successfully'
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Webhook processing failed', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)('payment/vnpay'),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook xác nhận thanh toán VNPAY' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Xử lý webhook thành công' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleVNPayWebhook", null);
__decorate([
    (0, common_1.Post)('payment/momo'),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook xác nhận thanh toán MOMO' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Xử lý webhook thành công' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleMomoWebhook", null);
__decorate([
    (0, common_1.Post)('payment/zalopay'),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook xác nhận thanh toán ZaloPay' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Xử lý webhook thành công' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleZaloPayWebhook", null);
__decorate([
    (0, common_1.Post)('payment/generic'),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook xác nhận thanh toán generic' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Xử lý webhook thành công' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleGenericWebhook", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, swagger_1.ApiTags)('🔗 Webhooks'),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map