import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ description: 'ID của tổ chức' })
  @IsNumber()
  organization_id: number;

  @ApiProperty({ description: 'Tên sự kiện' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mô tả sự kiện', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Ngày diễn ra sự kiện' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Địa điểm sự kiện', required: false })
  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateEventDto {
  @ApiProperty({ description: 'Tên sự kiện', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Mô tả sự kiện', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Ngày diễn ra sự kiện', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ description: 'Địa điểm sự kiện', required: false })
  @IsOptional()
  @IsString()
  location?: string;
}

export class EventResponseDto {
  @ApiProperty({ description: 'ID của sự kiện' })
  id: number;

  @ApiProperty({ description: 'ID của tổ chức' })
  organization_id: number;

  @ApiProperty({ description: 'Tên sự kiện' })
  name: string;

  @ApiProperty({ description: 'Mô tả sự kiện' })
  description: string;

  @ApiProperty({ description: 'Ngày diễn ra sự kiện' })
  date: Date;

  @ApiProperty({ description: 'Địa điểm sự kiện' })
  location: string;

  @ApiProperty({ description: 'Thời gian tạo' })
  created_at: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  updated_at: Date;

  @ApiProperty({ description: 'Thông tin tổ chức' })
  organization?: any;

  @ApiProperty({ description: 'Danh sách vé' })
  tickets?: any[];
} 