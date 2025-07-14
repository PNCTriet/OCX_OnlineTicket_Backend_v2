import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDecimal } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID người dùng', required: false })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiProperty({ description: 'Trạng thái đơn hàng' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Phương thức thanh toán' })
  @IsString()
  payment_method: string;

  @ApiProperty({ description: 'Tổng tiền' })
  @IsNumber()
  amount: number;
}

export class UpdateOrderDto {
  @ApiProperty({ description: 'ID người dùng', required: false })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiProperty({ description: 'Trạng thái đơn hàng', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Phương thức thanh toán', required: false })
  @IsOptional()
  @IsString()
  payment_method?: string;

  @ApiProperty({ description: 'Tổng tiền', required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;
}

export class OrderResponseDto {
  @ApiProperty({ description: 'ID đơn hàng' })
  id: number;

  @ApiProperty({ description: 'ID người dùng', required: false })
  user_id?: string;

  @ApiProperty({ description: 'Trạng thái đơn hàng' })
  status: string;

  @ApiProperty({ description: 'Phương thức thanh toán' })
  payment_method: string;

  @ApiProperty({ description: 'Tổng tiền' })
  amount: Decimal;

  @ApiProperty({ description: 'Thời gian tạo' })
  created_at: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  updated_at: Date;

  @ApiProperty({ description: 'Thông tin người dùng', required: false })
  user?: {
    id: string;
    name: string;
    email: string;
  };
} 