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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async purchaseTickets(purchaseDto, userId) {
        if (!purchaseDto.items || purchaseDto.items.length === 0) {
            throw new common_1.BadRequestException('Items are required');
        }
        let totalAmount = new library_1.Decimal(0);
        const orderItems = [];
        for (const item of purchaseDto.items) {
            const ticket = await this.prisma.ticket.findUnique({
                where: { id: item.ticketId },
            });
            if (!ticket) {
                throw new common_1.NotFoundException(`Ticket with ID ${item.ticketId} not found`);
            }
            if (!ticket.is_active) {
                throw new common_1.BadRequestException(`Ticket ${ticket.name} is not active`);
            }
            const remaining = ticket.total - ticket.sold;
            if (remaining < item.quantity) {
                throw new common_1.BadRequestException(`Not enough tickets available for ${ticket.name}`);
            }
            const itemTotal = ticket.price.mul(item.quantity);
            totalAmount = totalAmount.add(itemTotal);
            orderItems.push({
                ticket_id: item.ticketId,
                quantity: item.quantity,
                price_snapshot: ticket.price,
            });
        }
        let discountApplied = new library_1.Decimal(0);
        if (purchaseDto.promoCode) {
            const promoCode = await this.prisma.promoCode.findUnique({
                where: { code: purchaseDto.promoCode },
            });
            if (promoCode && promoCode.is_active && promoCode.uses < promoCode.max_uses) {
                if (promoCode.discount_type === 'PERCENTAGE') {
                    discountApplied = totalAmount.mul(promoCode.discount_value).div(100);
                }
                else {
                    discountApplied = promoCode.discount_value;
                }
                if (discountApplied.greaterThan(totalAmount)) {
                    discountApplied = totalAmount;
                }
            }
        }
        const finalAmount = totalAmount.sub(discountApplied);
        return this.prisma.$transaction(async (prisma) => {
            const order = await prisma.order.create({
                data: {
                    user_id: userId,
                    status: 'PENDING',
                    payment_method: purchaseDto.paymentMethod,
                    amount: finalAmount,
                },
                include: {
                    user: true,
                    order_items: {
                        include: {
                            ticket: true,
                        },
                    },
                    payments: true,
                },
            });
            for (const item of orderItems) {
                await prisma.orderItem.create({
                    data: {
                        order_id: order.id,
                        ticket_id: item.ticket_id,
                        quantity: item.quantity,
                        price_snapshot: item.price_snapshot,
                    },
                });
                await prisma.ticket.update({
                    where: { id: item.ticket_id },
                    data: {
                        sold: {
                            increment: item.quantity,
                        },
                    },
                });
            }
            await prisma.payment.create({
                data: {
                    order_id: order.id,
                    gateway: purchaseDto.paymentMethod.toLowerCase(),
                    status: 'PENDING',
                },
            });
            if (purchaseDto.promoCode && discountApplied.greaterThan(0)) {
                const promoCode = await prisma.promoCode.findUnique({
                    where: { code: purchaseDto.promoCode },
                });
                if (promoCode) {
                    await prisma.orderPromo.create({
                        data: {
                            order_id: order.id,
                            promo_code_id: promoCode.id,
                            discount_applied: discountApplied,
                        },
                    });
                    await prisma.promoCode.update({
                        where: { id: promoCode.id },
                        data: {
                            uses: {
                                increment: 1,
                            },
                        },
                    });
                }
            }
            return order;
        });
    }
    async getUserOrders(userId) {
        return this.prisma.order.findMany({
            where: { user_id: userId },
            include: {
                user: true,
                order_items: {
                    include: {
                        ticket: true,
                    },
                },
                payments: true,
                order_promos: {
                    include: {
                        promo_code: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async getUserOrder(orderId, userId) {
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                user_id: userId,
            },
            include: {
                user: true,
                order_items: {
                    include: {
                        ticket: true,
                    },
                },
                payments: true,
                order_promos: {
                    include: {
                        promo_code: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
        }
        return order;
    }
    async getPaymentStatus(orderId, userId) {
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                user_id: userId,
            },
            include: {
                payments: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
        }
        const payment = order.payments[0];
        return {
            orderId: order.id,
            status: order.status,
            paymentStatus: payment?.status || 'PENDING',
            paidAt: payment?.paid_at,
            transactionCode: payment?.txn_code,
        };
    }
    async findAll() {
        return this.prisma.order.findMany({
            include: {
                user: true,
                order_items: {
                    include: {
                        ticket: true,
                    },
                },
                payments: true,
                order_promos: {
                    include: {
                        promo_code: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async count() {
        return this.prisma.order.count();
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                order_items: {
                    include: {
                        ticket: true,
                    },
                },
                payments: true,
                order_promos: {
                    include: {
                        promo_code: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async create(createOrderDto) {
        return this.prisma.order.create({
            data: {
                user_id: createOrderDto.user_id,
                status: createOrderDto.status,
                payment_method: createOrderDto.payment_method,
                amount: new library_1.Decimal(createOrderDto.amount),
            },
            include: {
                user: true,
                order_items: {
                    include: {
                        ticket: true,
                    },
                },
                payments: true,
            },
        });
    }
    async update(id, updateOrderDto) {
        await this.findOne(id);
        const updateData = {};
        if (updateOrderDto.status !== undefined) {
            updateData.status = updateOrderDto.status;
        }
        if (updateOrderDto.payment_method !== undefined) {
            updateData.payment_method = updateOrderDto.payment_method;
        }
        if (updateOrderDto.amount !== undefined) {
            updateData.amount = new library_1.Decimal(updateOrderDto.amount);
        }
        return this.prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                user: true,
                order_items: {
                    include: {
                        ticket: true,
                    },
                },
                payments: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.order.delete({
            where: { id },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map