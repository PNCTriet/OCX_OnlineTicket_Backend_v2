import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto, TicketResponseDto } from './dto/ticket.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('🎫 Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // ===== PUBLIC ENDPOINTS (không cần auth) =====

  @Get('public/event/:eventId')
  @ApiOperation({ summary: 'Lấy danh sách vé có sẵn cho sự kiện' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách vé có sẵn',
    type: [TicketResponseDto] 
  })
  async getAvailableTickets(@Param('eventId') eventId: string): Promise<TicketResponseDto[]> {
    return this.ticketsService.getAvailableTickets(+eventId);
  }

  @Post('public/check-availability')
  @ApiOperation({ summary: 'Kiểm tra số lượng vé còn lại' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin số lượng vé',
    type: Object 
  })
  async checkAvailability(@Body() body: { ticketId: number; quantity: number }): Promise<{
    available: boolean;
    remaining: number;
    requested: number;
  }> {
    return this.ticketsService.checkAvailability(body.ticketId, body.quantity);
  }

  // ===== ADMIN ENDPOINTS (cần auth) =====

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách tất cả vé' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách vé',
    type: [TicketResponseDto] 
  })
  async findAll(): Promise<TicketResponseDto[]> {
    return this.ticketsService.findAll();
  }

  @Get('count')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Đếm tổng số vé' })
  @ApiResponse({ status: 200, description: 'Số lượng vé' })
  async count(): Promise<number> {
    return this.ticketsService.count();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin vé theo ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin vé',
    type: TicketResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vé' })
  async findOne(@Param('id') id: string): Promise<TicketResponseDto> {
    return this.ticketsService.findOne(+id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo vé mới' })
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo vé thành công',
    type: TicketResponseDto 
  })
  async create(@Body() createTicketDto: CreateTicketDto): Promise<TicketResponseDto> {
    return this.ticketsService.create(createTicketDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật thông tin vé' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật thành công',
    type: TicketResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vé' })
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<TicketResponseDto> {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa vé' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vé' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.ticketsService.remove(+id);
    return { message: 'Ticket deleted successfully' };
  }
} 