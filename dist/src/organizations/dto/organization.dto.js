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
exports.OrganizationResponseDto = exports.UpdateOrganizationDto = exports.CreateOrganizationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateOrganizationDto {
}
exports.CreateOrganizationDto = CreateOrganizationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tên tổ chức' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email liên hệ', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "contact_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Số điện thoại', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Địa chỉ', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "address", void 0);
class UpdateOrganizationDto {
}
exports.UpdateOrganizationDto = UpdateOrganizationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tên tổ chức', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganizationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email liên hệ', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateOrganizationDto.prototype, "contact_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Số điện thoại', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganizationDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Địa chỉ', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganizationDto.prototype, "address", void 0);
class OrganizationResponseDto {
}
exports.OrganizationResponseDto = OrganizationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID tổ chức' }),
    __metadata("design:type", Number)
], OrganizationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tên tổ chức' }),
    __metadata("design:type", String)
], OrganizationResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email liên hệ', required: false }),
    __metadata("design:type", String)
], OrganizationResponseDto.prototype, "contact_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Số điện thoại', required: false }),
    __metadata("design:type", String)
], OrganizationResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Địa chỉ', required: false }),
    __metadata("design:type", String)
], OrganizationResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thời gian tạo' }),
    __metadata("design:type", Date)
], OrganizationResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thời gian cập nhật' }),
    __metadata("design:type", Date)
], OrganizationResponseDto.prototype, "updated_at", void 0);
//# sourceMappingURL=organization.dto.js.map