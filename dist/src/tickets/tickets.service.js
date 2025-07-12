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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
let TicketsService = class TicketsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAvailableTickets(eventId) {
        return this.prisma.ticket.findMany({
            where: {
                event_id: eventId,
                is_active: true,
                sold: {
                    lt: this.prisma.ticket.fields.total,
                },
            },
            include: {
                event: true,
            },
            orderBy: { price: 'asc' },
        });
    }
    async checkAvailability(ticketId, quantity) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
        });
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID ${ticketId} not found`);
        }
        if (!ticket.is_active) {
            throw new common_1.BadRequestException('Ticket is not active');
        }
        const remaining = ticket.total - ticket.sold;
        const available = remaining >= quantity;
        return {
            available,
            remaining,
            requested: quantity,
        };
    }
    async findAll() {
        return this.prisma.ticket.findMany({
            include: {
                event: true,
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async count() {
        return this.prisma.ticket.count();
    }
    async findOne(id) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
            include: {
                event: true,
            },
        });
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID ${id} not found`);
        }
        return ticket;
    }
    async create(createTicketDto) {
        return this.prisma.ticket.create({
            data: {
                event_id: createTicketDto.event_id,
                name: createTicketDto.name,
                price: new library_1.Decimal(createTicketDto.price),
                type: createTicketDto.type,
                total: createTicketDto.total,
                sold: createTicketDto.sold || 0,
                start_sale_date: createTicketDto.start_sale_date ? new Date(createTicketDto.start_sale_date) : null,
                end_sale_date: createTicketDto.end_sale_date ? new Date(createTicketDto.end_sale_date) : null,
                is_active: createTicketDto.is_active !== undefined ? createTicketDto.is_active : true,
            },
            include: {
                event: true,
            },
        });
    }
    async update(id, updateTicketDto) {
        await this.findOne(id);
        const { price, ...data } = updateTicketDto;
        const updateData = { ...data };
        if (price !== undefined) {
            updateData.price = new library_1.Decimal(price);
        }
        return this.prisma.ticket.update({
            where: { id },
            data: updateData,
            include: {
                event: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.ticket.delete({
            where: { id },
        });
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map