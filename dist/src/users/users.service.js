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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại');
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại');
        }
        return user;
    }
    async update(id, updateUserDto, currentUser) {
        if (currentUser.id !== id && currentUser.role !== client_1.UserRole.ADMIN && currentUser.role !== client_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Không có quyền cập nhật thông tin người dùng này');
        }
        const user = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
        return user;
    }
    async findAll(currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.role !== client_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Không có quyền xem danh sách người dùng');
        }
        return this.prisma.user.findMany({
            orderBy: { created_at: 'desc' },
        });
    }
    async delete(id, currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.role !== client_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Không có quyền xóa người dùng');
        }
        if (currentUser.id === id) {
            throw new common_1.ForbiddenException('Không thể xóa tài khoản của chính mình');
        }
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại');
        }
        await this.prisma.user.delete({
            where: { id },
        });
    }
    async getCount(currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.role !== client_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Không có quyền xem số lượng người dùng');
        }
        return this.prisma.user.count();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map