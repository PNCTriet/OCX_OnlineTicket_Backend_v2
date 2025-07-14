import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID của đơn hàng' })
  @IsNumber()
  order_id: number;

  @ApiProperty({ description: 'Cổng thanh toán' })
  @IsString()
  gateway: string;

  @ApiProperty({ description: 'Trạng thái thanh toán' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Mã giao dịch', required: false })
  @IsOptional()
  @IsString()
  txn_code?: string;

  @ApiProperty({ description: 'Thời gian thanh toán', required: false })
  @IsOptional()
  @IsDateString()
  paid_at?: string;
}

export class UpdatePaymentDto {
  @ApiProperty({ description: 'Cổng thanh toán', required: false })
  @IsOptional()
  @IsString()
  gateway?: string;

  @ApiProperty({ description: 'Trạng thái thanh toán', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Mã giao dịch', required: false })
  @IsOptional()
  @IsString()
  txn_code?: string;

  @ApiProperty({ description: 'Thời gian thanh toán', required: false })
  @IsOptional()
  @IsDateString()
  paid_at?: string;
}

export class PaymentResponseDto {
  @ApiProperty({ description: 'ID của thanh toán' })
  id: number;

  @ApiProperty({ description: 'ID của đơn hàng' })
  order_id: number;

  @ApiProperty({ description: 'Cổng thanh toán' })
  gateway: string;

  @ApiProperty({ description: 'Trạng thái thanh toán' })
  status: string;

  @ApiProperty({ description: 'Mã giao dịch' })
  txn_code: string;

  @ApiProperty({ description: 'Thời gian thanh toán' })
  paid_at: Date;

  @ApiProperty({ description: 'Thời gian tạo' })
  created_at: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  updated_at: Date;

  @ApiProperty({ description: 'Thông tin đơn hàng' })
  order?: any;
} 