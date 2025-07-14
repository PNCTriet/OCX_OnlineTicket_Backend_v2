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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const payments_service_1 = require("./payments.service");
const payment_dto_1 = require("./dto/payment.dto");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async findAll(req) {
        return this.paymentsService.findAll(req.user);
    }
    async getRevenue(req) {
        return this.paymentsService.getRevenue(req.user);
    }
    async debugRevenue(req) {
        return this.paymentsService.debugRevenue(req.user);
    }
    async getRevenueByPeriod(period, req) {
        return this.paymentsService.getRevenueByPeriod(period, req.user);
    }
    async getCount(req) {
        return this.paymentsService.getCount(req.user);
    }
    async findById(id) {
        return this.paymentsService.findById(parseInt(id));
    }
    async create(createPaymentDto, req) {
        return this.paymentsService.create(createPaymentDto, req.user);
    }
    async update(id, updatePaymentDto, req) {
        return this.paymentsService.update(parseInt(id), updatePaymentDto, req.user);
    }
    async delete(id, req) {
        return this.paymentsService.delete(parseInt(id), req.user);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tất cả thanh toán (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách thanh toán',
        type: [payment_dto_1.PaymentResponseDto]
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền truy cập' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tổng doanh thu (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tổng doanh thu',
        type: Number
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền truy cập' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('revenue/debug'),
    (0, swagger_1.ApiOperation)({ summary: 'Debug revenue calculation (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Debug information',
        type: Object
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền truy cập' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "debugRevenue", null);
__decorate([
    (0, common_1.Get)('revenue/:period'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy doanh thu theo thời gian (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Doanh thu theo thời gian',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            label: { type: 'string' },
                            value: { type: 'number' }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền truy cập' }),
    __param(0, (0, common_1.Param)('period')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getRevenueByPeriod", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy số lượng thanh toán (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Số lượng thanh toán',
        type: Number
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền truy cập' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin thanh toán theo ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Thông tin thanh toán',
        type: payment_dto_1.PaymentResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Thanh toán không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo thanh toán mới (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Tạo thanh toán thành công',
        type: payment_dto_1.PaymentResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền tạo thanh toán' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.CreatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thanh toán (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cập nhật thành công',
        type: payment_dto_1.PaymentResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền cập nhật' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Thanh toán không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_dto_1.UpdatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa thanh toán (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Xóa thành công'
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền xóa' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Thanh toán không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "delete", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('💳 Payments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map