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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPublicEvents() {
        return this.prisma.event.findMany({
            where: {
                date: {
                    gte: new Date(),
                },
            },
            include: {
                organization: true,
                tickets: {
                    where: {
                        is_active: true,
                    },
                },
            },
            orderBy: { date: 'asc' },
        });
    }
    async getPublicEvent(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                organization: true,
                tickets: {
                    where: {
                        is_active: true,
                    },
                },
            },
        });
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }
    async findAll() {
        return this.prisma.event.findMany({
            include: {
                organization: true,
                tickets: true,
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async count() {
        return this.prisma.event.count();
    }
    async findOne(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                organization: true,
                tickets: true,
            },
        });
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }
    async create(createEventDto) {
        const { date, ...data } = createEventDto;
        return this.prisma.event.create({
            data: {
                ...data,
                date: new Date(date),
            },
            include: {
                organization: true,
                tickets: true,
            },
        });
    }
    async update(id, updateEventDto) {
        await this.findOne(id);
        const { date, ...data } = updateEventDto;
        const updateData = { ...data };
        if (date !== undefined) {
            updateData.date = new Date(date);
        }
        return this.prisma.event.update({
            where: { id },
            data: updateData,
            include: {
                organization: true,
                tickets: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.event.delete({
            where: { id },
        });
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map