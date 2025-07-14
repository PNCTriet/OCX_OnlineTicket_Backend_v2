import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto, EventResponseDto } from './dto/event.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('🎭 Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // ===== PUBLIC ENDPOINTS (không cần auth) =====

  @Get('public')
  @ApiOperation({ summary: 'Lấy danh sách sự kiện công khai' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách sự kiện',
    type: [EventResponseDto] 
  })
  async getPublicEvents(): Promise<EventResponseDto[]> {
    return this.eventsService.getPublicEvents();
  }

  @Get('public/:id')
  @ApiOperation({ summary: 'Lấy thông tin sự kiện công khai theo ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin sự kiện',
    type: EventResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sự kiện' })
  async getPublicEvent(@Param('id') id: string): Promise<EventResponseDto> {
    return this.eventsService.getPublicEvent(+id);
  }

  // ===== ADMIN ENDPOINTS (cần auth) =====

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách tất cả sự kiện (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách sự kiện',
    type: [EventResponseDto] 
  })
  async findAll(): Promise<EventResponseDto[]> {
    return this.eventsService.findAll();
  }

  @Get('count')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Đếm tổng số sự kiện' })
  @ApiResponse({ status: 200, description: 'Số lượng sự kiện' })
  async count(): Promise<number> {
    return this.eventsService.count();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin sự kiện theo ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin sự kiện',
    type: EventResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sự kiện' })
  async findOne(@Param('id') id: string): Promise<EventResponseDto> {
    return this.eventsService.findOne(+id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo sự kiện mới' })
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo sự kiện thành công',
    type: EventResponseDto 
  })
  async create(@Body() createEventDto: CreateEventDto): Promise<EventResponseDto> {
    return this.eventsService.create(createEventDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật thông tin sự kiện' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật thành công',
    type: EventResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sự kiện' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa sự kiện' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sự kiện' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.eventsService.remove(+id);
    return { message: 'Event deleted successfully' };
  }
} 