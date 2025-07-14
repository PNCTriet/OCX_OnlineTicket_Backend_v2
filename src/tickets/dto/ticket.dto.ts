import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsBoolean } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateTicketDto {
  @ApiProperty({ description: 'ID của sự kiện' })
  @IsNumber()
  event_id: number;

  @ApiProperty({ description: 'Tên vé' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Giá vé' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Loại vé' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Tổng số vé' })
  @IsNumber()
  total: number;

  @ApiProperty({ description: 'Số vé đã bán', required: false })
  @IsOptional()
  @IsNumber()
  sold?: number;

  @ApiProperty({ description: 'Ngày bắt đầu bán', required: false })
  @IsOptional()
  @IsDateString()
  start_sale_date?: string;

  @ApiProperty({ description: 'Ngày kết thúc bán', required: false })
  @IsOptional()
  @IsDateString()
  end_sale_date?: string;

  @ApiProperty({ description: 'Trạng thái hoạt động', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateTicketDto {
  @ApiProperty({ description: 'Tên vé', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Giá vé', required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ description: 'Loại vé', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: 'Tổng số vé', required: false })
  @IsOptional()
  @IsNumber()
  total?: number;

  @ApiProperty({ description: 'Số vé đã bán', required: false })
  @IsOptional()
  @IsNumber()
  sold?: number;

  @ApiProperty({ description: 'Ngày bắt đầu bán', required: false })
  @IsOptional()
  @IsDateString()
  start_sale_date?: string;

  @ApiProperty({ description: 'Ngày kết thúc bán', required: false })
  @IsOptional()
  @IsDateString()
  end_sale_date?: string;

  @ApiProperty({ description: 'Trạng thái hoạt động', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class TicketResponseDto {
  @ApiProperty({ description: 'ID của vé' })
  id: number;

  @ApiProperty({ description: 'ID của sự kiện' })
  event_id: number;

  @ApiProperty({ description: 'Tên vé' })
  name: string;

  @ApiProperty({ description: 'Giá vé' })
  price: Decimal;

  @ApiProperty({ description: 'Loại vé' })
  type: string;

  @ApiProperty({ description: 'Tổng số vé' })
  total: number;

  @ApiProperty({ description: 'Số vé đã bán' })
  sold: number;

  @ApiProperty({ description: 'Ngày bắt đầu bán' })
  start_sale_date: Date;

  @ApiProperty({ description: 'Ngày kết thúc bán' })
  end_sale_date: Date;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  is_active: boolean;

  @ApiProperty({ description: 'Thời gian tạo' })
  created_at: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  updated_at: Date;

  @ApiProperty({ description: 'Thông tin sự kiện' })
  event?: any;
} 