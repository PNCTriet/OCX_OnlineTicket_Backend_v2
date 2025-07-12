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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentResponseDto = exports.UpdatePaymentDto = exports.CreatePaymentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePaymentDto {
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID của đơn hàng' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cổng thanh toán' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "gateway", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trạng thái thanh toán' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mã giao dịch', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "txn_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thời gian thanh toán', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paid_at", void 0);
class UpdatePaymentDto {
}
exports.UpdatePaymentDto = UpdatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cổng thanh toán', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentDto.prototype, "gateway", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trạng thái thanh toán', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mã giao dịch', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentDto.prototype, "txn_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thời gian thanh toán', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePaymentDto.prototype, "paid_at", void 0);
class PaymentResponseDto {
}
exports.PaymentResponseDto = PaymentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID của thanh toán' }),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID của đơn hàng' }),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cổng thanh toán' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "gateway", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trạng thái thanh toán' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mã giao dịch' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "txn_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thời gian thanh toán' }),
    __metadata("design:type", Date)
], PaymentResponseDto.prototype, "paid_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thời gian tạo' }),
    __metadata("design:type", Date)
], PaymentResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thời gian cập nhật' }),
    __metadata("design:type", Date)
], PaymentResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thông tin đơn hàng' }),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "order", void 0);
//# sourceMappingURL=payment.dto.js.map