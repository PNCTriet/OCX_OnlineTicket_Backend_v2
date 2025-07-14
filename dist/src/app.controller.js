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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const prisma_service_1 = require("./common/prisma/prisma.service");
let AppController = class AppController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, totalEvents, totalTickets, totalRevenue, recentOrders,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.event.count(),
            this.prisma.ticket.count(),
            this.prisma.order.aggregate({
                where: {
                    status: 'COMPLETED',
                },
                _sum: {
                    amount: true,
                },
            }),
            this.prisma.order.findMany({
                take: 5,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    order_items: {
                        include: {
                            ticket: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
            }),
        ]);
        return {
            totalUsers,
            totalEvents,
            totalTickets,
            totalRevenue: totalRevenue._sum.amount || 0,
            recentOrders: recentOrders.map(order => ({
                id: order.id,
                status: order.status,
                amount: order.amount,
                createdAt: order.created_at,
                user: order.user,
                items: order.order_items.map(item => ({
                    ticketName: item.ticket.name,
                    quantity: item.quantity,
                    price: item.price_snapshot,
                })),
            })),
        };
    }
    getHealth() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('api/dashboard/stats'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thống kê tổng quan cho dashboard' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Thống kê tổng quan',
        type: Object
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('api/health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('📊 Dashboard'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map