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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const order_dto_1 = require("./dto/order.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async purchaseTickets(purchaseDto, req) {
        return this.ordersService.purchaseTickets(purchaseDto, req.user.id);
    }
    async getMyOrders(req) {
        return this.ordersService.getUserOrders(req.user.id);
    }
    async getMyOrder(id, req) {
        return this.ordersService.getUserOrder(+id, req.user.id);
    }
    async getPaymentStatus(id, req) {
        return this.ordersService.getPaymentStatus(+id, req.user.id);
    }
    async findAll() {
        return this.ordersService.findAll();
    }
    async count() {
        const count = await this.ordersService.count();
        return { count };
    }
    async findOne(id) {
        return this.ordersService.findOne(+id);
    }
    async create(createOrderDto) {
        return this.ordersService.create(createOrderDto);
    }
    async update(id, updateOrderDto) {
        return this.ordersService.update(+id, updateOrderDto);
    }
    async remove(id) {
        await this.ordersService.remove(+id);
        return { message: 'Order deleted successfully' };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)('purchase'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Mua vé' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Mua vé thành công',
        type: order_dto_1.OrderResponseDto
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "purchaseTickets", null);
__decorate([
    (0, common_1.Get)('my-orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách đơn hàng của user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách đơn hàng',
        type: [order_dto_1.OrderResponseDto]
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)('my-orders/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy chi tiết đơn hàng của user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chi tiết đơn hàng',
        type: order_dto_1.OrderResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy đơn hàng' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getMyOrder", null);
__decorate([
    (0, common_1.Get)('my-orders/:id/payment-status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Kiểm tra trạng thái thanh toán của đơn hàng' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Trạng thái thanh toán',
        type: Object
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy đơn hàng' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getPaymentStatus", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tất cả đơn hàng (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách đơn hàng',
        type: [order_dto_1.OrderResponseDto]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Đếm tổng số đơn hàng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Số lượng đơn hàng' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "count", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin đơn hàng theo ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Thông tin đơn hàng',
        type: order_dto_1.OrderResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy đơn hàng' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo đơn hàng mới' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Tạo đơn hàng thành công',
        type: order_dto_1.OrderResponseDto
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin đơn hàng' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cập nhật thành công',
        type: order_dto_1.OrderResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy đơn hàng' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa đơn hàng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Xóa thành công' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy đơn hàng' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "remove", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('🛒 Orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map