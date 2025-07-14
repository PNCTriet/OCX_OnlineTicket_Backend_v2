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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const user_dto_1 = require("./dto/user.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getCurrentUser(req) {
        return this.usersService.findById(req.user.id);
    }
    async findAll(req) {
        return this.usersService.findAll(req.user);
    }
    async getCount(req) {
        return this.usersService.getCount(req.user);
    }
    async findById(id) {
        return this.usersService.findById(id);
    }
    async update(id, updateUserDto, req) {
        return this.usersService.update(id, updateUserDto, req.user);
    }
    async delete(id, req) {
        return this.usersService.delete(id, req.user);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin người dùng hiện tại' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Thông tin người dùng',
        type: user_dto_1.UserResponseDto
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tất cả người dùng (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách người dùng',
        type: [user_dto_1.UserResponseDto]
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền truy cập' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy số lượng người dùng (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Số lượng người dùng',
        type: Number
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền truy cập' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin người dùng theo ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Thông tin người dùng',
        type: user_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Người dùng không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin người dùng' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cập nhật thành công',
        type: user_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền cập nhật' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Người dùng không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa người dùng (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Xóa thành công' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền xóa' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Người dùng không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('👥 Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map