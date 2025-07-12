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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tickets_service_1 = require("./tickets.service");
const ticket_dto_1 = require("./dto/ticket.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let TicketsController = class TicketsController {
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
    }
    async getAvailableTickets(eventId) {
        return this.ticketsService.getAvailableTickets(+eventId);
    }
    async checkAvailability(body) {
        return this.ticketsService.checkAvailability(body.ticketId, body.quantity);
    }
    async findAll() {
        return this.ticketsService.findAll();
    }
    async count() {
        return this.ticketsService.count();
    }
    async findOne(id) {
        return this.ticketsService.findOne(+id);
    }
    async create(createTicketDto) {
        return this.ticketsService.create(createTicketDto);
    }
    async update(id, updateTicketDto) {
        return this.ticketsService.update(+id, updateTicketDto);
    }
    async remove(id) {
        await this.ticketsService.remove(+id);
        return { message: 'Ticket deleted successfully' };
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Get)('public/event/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách vé có sẵn cho sự kiện' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách vé có sẵn',
        type: [ticket_dto_1.TicketResponseDto]
    }),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "getAvailableTickets", null);
__decorate([
    (0, common_1.Post)('public/check-availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Kiểm tra số lượng vé còn lại' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Thông tin số lượng vé',
        type: Object
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tất cả vé' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách vé',
        type: [ticket_dto_1.TicketResponseDto]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Đếm tổng số vé' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Số lượng vé' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "count", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin vé theo ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Thông tin vé',
        type: ticket_dto_1.TicketResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy vé' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo vé mới' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Tạo vé thành công',
        type: ticket_dto_1.TicketResponseDto
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ticket_dto_1.CreateTicketDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin vé' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cập nhật thành công',
        type: ticket_dto_1.TicketResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy vé' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ticket_dto_1.UpdateTicketDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa vé' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Xóa thành công' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy vé' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "remove", null);
exports.TicketsController = TicketsController = __decorate([
    (0, swagger_1.ApiTags)('🎫 Tickets'),
    (0, common_1.Controller)('tickets'),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map