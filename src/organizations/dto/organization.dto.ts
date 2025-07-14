import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'Tên tổ chức' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email liên hệ', required: false })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Địa chỉ', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateOrganizationDto {
  @ApiProperty({ description: 'Tên tổ chức', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Email liên hệ', required: false })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Địa chỉ', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}

export class OrganizationResponseDto {
  @ApiProperty({ description: 'ID tổ chức' })
  id: number;

  @ApiProperty({ description: 'Tên tổ chức' })
  name: string;

  @ApiProperty({ description: 'Email liên hệ', required: false })
  contact_email?: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  phone?: string;

  @ApiProperty({ description: 'Địa chỉ', required: false })
  address?: string;

  @ApiProperty({ description: 'Thời gian tạo' })
  created_at: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  updated_at: Date;
} 