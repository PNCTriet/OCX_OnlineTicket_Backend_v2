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
exports.OrganizationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const organizations_service_1 = require("./organizations.service");
const organization_dto_1 = require("./dto/organization.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let OrganizationsController = class OrganizationsController {
    constructor(organizationsService) {
        this.organizationsService = organizationsService;
    }
    async findAll() {
        return this.organizationsService.findAll();
    }
    async count() {
        const count = await this.organizationsService.count();
        return { count };
    }
    async findOne(id) {
        return this.organizationsService.findOne(+id);
    }
    async create(createOrganizationDto) {
        return this.organizationsService.create(createOrganizationDto);
    }
    async update(id, updateOrganizationDto) {
        return this.organizationsService.update(+id, updateOrganizationDto);
    }
    async remove(id) {
        await this.organizationsService.remove(+id);
        return { message: 'Organization deleted successfully' };
    }
};
exports.OrganizationsController = OrganizationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tất cả tổ chức' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách tổ chức',
        type: [organization_dto_1.OrganizationResponseDto]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Đếm tổng số tổ chức' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Số lượng tổ chức' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "count", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin tổ chức theo ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Thông tin tổ chức',
        type: organization_dto_1.OrganizationResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy tổ chức' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo tổ chức mới' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Tạo tổ chức thành công',
        type: organization_dto_1.OrganizationResponseDto
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [organization_dto_1.CreateOrganizationDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin tổ chức' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cập nhật thành công',
        type: organization_dto_1.OrganizationResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy tổ chức' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, organization_dto_1.UpdateOrganizationDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa tổ chức' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Xóa thành công' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy tổ chức' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "remove", null);
exports.OrganizationsController = OrganizationsController = __decorate([
    (0, swagger_1.ApiTags)('🏢 Organizations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('organizations'),
    __metadata("design:paramtypes", [organizations_service_1.OrganizationsService])
], OrganizationsController);
//# sourceMappingURL=organizations.controller.js.map