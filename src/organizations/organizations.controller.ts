import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationResponseDto } from './dto/organization.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('🏢 Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả tổ chức' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách tổ chức',
    type: [OrganizationResponseDto] 
  })
  async findAll(): Promise<OrganizationResponseDto[]> {
    return this.organizationsService.findAll();
  }

  @Get('count')
  @ApiOperation({ summary: 'Đếm tổng số tổ chức' })
  @ApiResponse({ status: 200, description: 'Số lượng tổ chức' })
  async count(): Promise<{ count: number }> {
    const count = await this.organizationsService.count();
    return { count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin tổ chức theo ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin tổ chức',
    type: OrganizationResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tổ chức' })
  async findOne(@Param('id') id: string): Promise<OrganizationResponseDto> {
    return this.organizationsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo tổ chức mới' })
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo tổ chức thành công',
    type: OrganizationResponseDto 
  })
  async create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin tổ chức' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật thành công',
    type: OrganizationResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tổ chức' })
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa tổ chức' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tổ chức' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.organizationsService.remove(+id);
    return { message: 'Organization deleted successfully' };
  }
} 