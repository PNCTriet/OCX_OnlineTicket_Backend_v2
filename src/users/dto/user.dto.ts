import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ description: 'ID của người dùng' })
  id: string;

  @ApiProperty({ description: 'Email của người dùng' })
  email: string;

  @ApiProperty({ description: 'Tên người dùng' })
  name: string;

  @ApiProperty({ description: 'Vai trò người dùng', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'Trạng thái xác thực' })
  is_verified: boolean;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  phone?: string;

  @ApiProperty({ description: 'URL avatar', required: false })
  avatar_url?: string;

  @ApiProperty({ description: 'Thời gian tạo' })
  created_at: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  updated_at: Date;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Tên người dùng', required: false })
  name?: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  phone?: string;

  @ApiProperty({ description: 'URL avatar', required: false })
  avatar_url?: string;
} 