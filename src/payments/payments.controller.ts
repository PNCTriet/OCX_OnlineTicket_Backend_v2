import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentResponseDto } from './dto/payment.dto';

@ApiTags('💳 Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả thanh toán (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách thanh toán',
    type: [PaymentResponseDto] 
  })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  async findAll(@Request() req): Promise<PaymentResponseDto[]> {
    return this.paymentsService.findAll(req.user);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Lấy tổng doanh thu (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tổng doanh thu',
    type: Number 
  })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  async getRevenue(@Request() req): Promise<number> {
    return this.paymentsService.getRevenue(req.user);
  }

  @Get('revenue/debug')
  @ApiOperation({ summary: 'Debug revenue calculation (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Debug information',
    type: Object 
  })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  async debugRevenue(@Request() req): Promise<any> {
    return this.paymentsService.debugRevenue(req.user);
  }

  @Get('revenue/:period')
  @ApiOperation({ summary: 'Lấy doanh thu theo thời gian (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Doanh thu theo thời gian',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              value: { type: 'number' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  async getRevenueByPeriod(
    @Param('period') period: string,
    @Request() req
  ): Promise<{ data: { label: string; value: number }[] }> {
    return this.paymentsService.getRevenueByPeriod(period, req.user);
  }

  @Get('count')
  @ApiOperation({ summary: 'Lấy số lượng thanh toán (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Số lượng thanh toán',
    type: Number 
  })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  async getCount(@Request() req): Promise<number> {
    return this.paymentsService.getCount(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin thanh toán theo ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin thanh toán',
    type: PaymentResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Thanh toán không tồn tại' })
  async findById(@Param('id') id: string): Promise<PaymentResponseDto> {
    return this.paymentsService.findById(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Tạo thanh toán mới (Admin only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo thanh toán thành công',
    type: PaymentResponseDto 
  })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo thanh toán' })
  async create(@Body() createPaymentDto: CreatePaymentDto, @Request() req): Promise<PaymentResponseDto> {
    return this.paymentsService.create(createPaymentDto, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thanh toán (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật thành công',
    type: PaymentResponseDto 
  })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật' })
  @ApiResponse({ status: 404, description: 'Thanh toán không tồn tại' })
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @Request() req
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.update(parseInt(id), updatePaymentDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thanh toán (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Xóa thành công' 
  })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa' })
  @ApiResponse({ status: 404, description: 'Thanh toán không tồn tại' })
  async delete(@Param('id') id: string, @Request() req): Promise<{ message: string }> {
    return this.paymentsService.delete(parseInt(id), req.user);
  }
} 