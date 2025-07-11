import { Controller, Get, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('👥 Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin người dùng hiện tại' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin người dùng',
    type: UserResponseDto 
  })
  async getCurrentUser(@Request() req): Promise<UserResponseDto> {
    return this.usersService.findById(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách người dùng',
    type: [UserResponseDto] 
  })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  async findAll(@Request() req): Promise<UserResponseDto[]> {
    return this.usersService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin người dùng',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật thành công',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật' })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng (Admin only)' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa' })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  async delete(@Param('id') id: string, @Request() req): Promise<void> {
    return this.usersService.delete(id, req.user);
  }
} 