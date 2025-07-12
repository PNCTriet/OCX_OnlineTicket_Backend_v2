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
exports.TicketResponseDto = exports.UpdateTicketDto = exports.CreateTicketDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const library_1 = require("@prisma/client/runtime/library");
class CreateTicketDto {
}
exports.CreateTicketDto = CreateTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID của sự kiện' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "event_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tên vé' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Giá vé' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Loại vé' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tổng số vé' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Số vé đã bán', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "sold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ngày bắt đầu bán', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "start_sale_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ngày kết thúc bán', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "end_sale_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trạng thái hoạt động', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTicketDto.prototype, "is_active", void 0);
class UpdateTicketDto {
}
exports.UpdateTicketDto = UpdateTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tên vé', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Giá vé', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTicketDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Loại vé', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tổng số vé', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTicketDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Số vé đã bán', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTicketDto.prototype, "sold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ngày bắt đầu bán', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "start_sale_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ngày kết thúc bán', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "end_sale_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trạng thái hoạt động', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTicketDto.prototype, "is_active", void 0);
class TicketResponseDto {
}
exports.TicketResponseDto = TicketResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID của vé' }),
    __metadata("design:type", Number)
], TicketResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID của sự kiện' }),
    __metadata("design:type", Number)
], TicketResponseDto.prototype, "event_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tên vé' }),
    __metadata("design:type", String)
], TicketResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Giá vé' }),
    __metadata("design:type", library_1.Decimal)
], TicketResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Loại vé' }),
    __metadata("design:type", String)
], TicketResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tổng số vé' }),
    __metadata("design:type", Number)
], TicketResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Số vé đã bán' }),
    __metadata("design:type", Number)
], TicketResponseDto.prototype, "sold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ngày bắt đầu bán' }),
    __metadata("design:type", Date)
], TicketResponseDto.prototype, "start_sale_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ngày kết thúc bán' }),
    __metadata("design:type", Date)
], TicketResponseDto.prototype, "end_sale_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trạng thái hoạt động' }),
    __metadata("design:type", Boolean)
], TicketResponseDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thời gian tạo' }),
    __metadata("design:type", Date)
], TicketResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thời gian cập nhật' }),
    __metadata("design:type", Date)
], TicketResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thông tin sự kiện' }),
    __metadata("design:type", Object)
], TicketResponseDto.prototype, "event", void 0);
//# sourceMappingURL=ticket.dto.js.map