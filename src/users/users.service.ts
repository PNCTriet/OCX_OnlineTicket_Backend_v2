import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUser: any): Promise<UserResponseDto> {
    // Kiểm tra quyền: chỉ có thể cập nhật thông tin của chính mình hoặc là admin
    if (currentUser.id !== id && currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không có quyền cập nhật thông tin người dùng này');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return user;
  }

  async findAll(currentUser: any): Promise<UserResponseDto[]> {
    // Chỉ admin mới có thể xem danh sách tất cả người dùng
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không có quyền xem danh sách người dùng');
    }

    return this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async delete(id: string, currentUser: any): Promise<void> {
    // Kiểm tra quyền: chỉ admin mới có thể xóa người dùng
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không có quyền xóa người dùng');
    }

    // Không cho phép xóa chính mình
    if (currentUser.id === id) {
      throw new ForbiddenException('Không thể xóa tài khoản của chính mình');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }
} 