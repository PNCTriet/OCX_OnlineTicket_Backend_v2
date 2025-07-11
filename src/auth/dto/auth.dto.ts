import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email của người dùng' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Mật khẩu' })
  @IsString()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'Email của người dùng' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Tên người dùng' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mật khẩu' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Access token' })
  accessToken: string;

  @ApiProperty({ description: 'Thông tin người dùng' })
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    is_verified: boolean;
  };
} 