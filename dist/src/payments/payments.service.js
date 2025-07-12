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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.role !== client_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Không có quyền xem danh sách thanh toán');
        }
        return this.prisma.payment.findMany({
            include: {
                order: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async getCount(currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.role !== client_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Không có quyền xem số lượng thanh toán');
        }
        return this.prisma.payment.count();
    }
    async getRevenue(currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.role !== client_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Không có quyền xem doanh thu');
        }
        const result = await this.prisma.order.aggregate({
            where: {
                status: 'COMPLETED',
                payments: {
                    some: {
                        status: 'SUCCESS',
                    },
                },
            },
            _sum: {
                amount: true,
            },
        });
        return result._sum.amount ? Number(result._sum.amount) : 0;
    }
    async getRevenueByPeriod(period, currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.role !== client_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Không có quyền xem doanh thu');
        }
        if (!['week', 'month', 'year'].includes(period)) {
            throw new common_1.BadRequestException('Period must be week, month, or year');
        }
        const now = new Date();
        let startDate;
        let groupByFormat;
        let labels;
        switch (period) {
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 6);
                groupByFormat = '%Y-%m-%d';
                labels = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(now);
                    date.setDate(now.getDate() - (6 - i));
                    return date.toISOString().split('T')[0];
                });
                break;
            case 'month':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 11);
                startDate.setDate(1);
                groupByFormat = '%Y-%m';
                labels = Array.from({ length: 12 }, (_, i) => {
                    const date = new Date(now);
                    date.setMonth(now.getMonth() - (11 - i));
                    return date.toISOString().slice(0, 7);
                });
                break;
            case 'year':
                startDate = new Date(now);
                startDate.setFullYear(now.getFullYear() - 4);
                startDate.setMonth(0, 1);
                groupByFormat = '%Y';
                labels = Array.from({ length: 5 }, (_, i) => {
                    const date = new Date(now);
                    date.setFullYear(now.getFullYear() - (4 - i));
                    return date.getFullYear().toString();
                });
                break;
        }
        const revenueData = await this.prisma.order.groupBy({
            by: ['created_at'],
            where: {
                status: 'COMPLETED',
                payments: {
                    some: {
                        status: 'SUCCESS'
                    }
                },
                created_at: {
                    gte: startDate
                }
            },
            _sum: {
                amount: true
            }
        });
        const formattedData = labels.map(label => {
            const dataPoint = revenueData.find(d => {
                const date = new Date(d.created_at);
                switch (period) {
                    case 'week':
                        return date.toISOString().split('T')[0] === label;
                    case 'month':
                        return date.toISOString().slice(0, 7) === label;
                    case 'year':
                        return date.getFullYear().toString() === label;
                }
            });
            return {
                label: this.formatLabel(label, period),
                value: dataPoint?._sum.amount ? Number(dataPoint._sum.amount) : 0
            };
        });
        return { data: formattedData };
    }
    formatLabel(label, period) {
        switch (period) {
            case 'week':
                const date = new Date(label);
                return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            case 'month':
                const [year, month] = label.split('-');
                return `${month}/${year}`;
            case 'year':
                return label;
            default:
                return label;
        }
    }
    async debugRevenue(currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.role !== client_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Không có quyền debug doanh thu');
        }
        const allOrders = await this.prisma.order.findMany({
            include: {
                payments: true,
                user: true,
            },
            orderBy: { created_at: 'desc' },
        });
        const completedOrders = allOrders.filter(order => order.status === 'COMPLETED');
        const successPayments = await this.prisma.payment.findMany({
            where: {
                status: 'SUCCESS',
            },
            include: {
                order: true,
            },
        });
        const currentRevenue = await this.prisma.order.aggregate({
            where: {
                status: 'COMPLETED',
                payments: {
                    some: {
                        status: 'SUCCESS',
                    },
                },
            },
            _sum: {
                amount: true,
            },
        });
        let manualRevenue = 0;
        for (const payment of successPayments) {
            if (payment.order) {
                manualRevenue += Number(payment.order.amount);
            }
        }
        return {
            debug: {
                totalOrders: allOrders.length,
                completedOrders: completedOrders.length,
                successPayments: successPayments.length,
                currentRevenueCalculation: currentRevenue._sum.amount ? Number(currentRevenue._sum.amount) : 0,
                manualRevenueCalculation: manualRevenue,
                allOrdersDetails: allOrders.map(order => ({
                    id: order.id,
                    status: order.status,
                    amount: order.amount,
                    user: order.user?.name,
                    payments: order.payments.map(p => ({
                        id: p.id,
                        status: p.status,
                        gateway: p.gateway,
                        txn_code: p.txn_code,
                        paid_at: p.paid_at,
                    })),
                })),
                successPaymentsDetails: successPayments.map(payment => ({
                    id: payment.id,
                    order_id: payment.order_id,
                    status: payment.status,
                    gateway: payment.gateway,
                    txn_code: payment.txn_code,
                    paid_at: payment.paid_at,
                    order_amount: payment.order?.amount,
                })),
            },
        };
    }
    async findById(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Thanh toán không tồn tại');
        }
        return payment;
    }
    async create(createPaymentDto, currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.role !== client_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Không có quyền tạo thanh toán');
        }
        return this.prisma.payment.create({
            data: {
                order_id: createPaymentDto.order_id,
                gateway: createPaymentDto.gateway,
                status: createPaymentDto.status,
                txn_code: createPaymentDto.txn_code,
                paid_at: createPaymentDto.paid_at ? new Date(createPaymentDto.paid_at) : null,
            },
            include: {
                order: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
    async update(id, updatePaymentDto, currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.role !== client_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Không có quyền cập nhật thanh toán');
        }
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Thanh toán không tồn tại');
        }
        return this.prisma.payment.update({
            where: { id },
            data: {
                gateway: updatePaymentDto.gateway,
                status: updatePaymentDto.status,
                txn_code: updatePaymentDto.txn_code,
                paid_at: updatePaymentDto.paid_at ? new Date(updatePaymentDto.paid_at) : undefined,
            },
            include: {
                order: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
    async delete(id, currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.role !== client_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Không có quyền xóa thanh toán');
        }
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Thanh toán không tồn tại');
        }
        await this.prisma.payment.delete({
            where: { id },
        });
        return { message: 'Thanh toán đã được xóa thành công' };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map