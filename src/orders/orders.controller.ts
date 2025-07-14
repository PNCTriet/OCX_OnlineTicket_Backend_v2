import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto, OrderResponseDto } from './dto/order.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('🛒 Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ===== PUBLIC ENDPOINTS (cần auth cho mua vé) =====

  @Post('purchase')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mua vé' })
  @ApiResponse({ 
    status: 201, 
    description: 'Mua vé thành công',
    type: OrderResponseDto 
  })
  async purchaseTickets(
    @Body() purchaseDto: {
      items: Array<{ ticketId: number; quantity: number }>;
      paymentMethod: string;
      promoCode?: string;
    },
    @Request() req
  ): Promise<OrderResponseDto> {
    return this.ordersService.purchaseTickets(purchaseDto, req.user.id);
  }

  @Get('my-orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách đơn hàng',
    type: [OrderResponseDto] 
  })
  async getMyOrders(@Request() req): Promise<OrderResponseDto[]> {
    return this.ordersService.getUserOrders(req.user.id);
  }

  @Get('my-orders/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng của user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Chi tiết đơn hàng',
    type: OrderResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  async getMyOrder(@Param('id') id: string, @Request() req): Promise<OrderResponseDto> {
    return this.ordersService.getUserOrder(+id, req.user.id);
  }

  @Get('my-orders/:id/payment-status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Kiểm tra trạng thái thanh toán của đơn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trạng thái thanh toán',
    type: Object 
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  async getPaymentStatus(@Param('id') id: string, @Request() req): Promise<{
    orderId: number;
    status: string;
    paymentStatus: string;
    paidAt?: Date;
    transactionCode?: string;
  }> {
    return this.ordersService.getPaymentStatus(+id, req.user.id);
  }

  // ===== ADMIN ENDPOINTS (cần auth) =====

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách tất cả đơn hàng (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách đơn hàng',
    type: [OrderResponseDto] 
  })
  async findAll(): Promise<OrderResponseDto[]> {
    return this.ordersService.findAll();
  }

  @Get('count')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Đếm tổng số đơn hàng' })
  @ApiResponse({ status: 200, description: 'Số lượng đơn hàng' })
  async count(): Promise<{ count: number }> {
    const count = await this.ordersService.count();
    return { count };
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin đơn hàng theo ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin đơn hàng',
    type: OrderResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.ordersService.findOne(+id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo đơn hàng thành công',
    type: OrderResponseDto 
  })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.ordersService.create(createOrderDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật thông tin đơn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật thành công',
    type: OrderResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa đơn hàng' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.ordersService.remove(+id);
    return { message: 'Order deleted successfully' };
  }
} 