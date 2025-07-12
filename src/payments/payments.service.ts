import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentResponseDto } from './dto/payment.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(currentUser: any): Promise<PaymentResponseDto[]> {
    // Chỉ admin mới có thể xem danh sách tất cả thanh toán
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không có quyền xem danh sách thanh toán');
    }

    return this.prisma.payment.findMany({
      include: {
        order: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getCount(currentUser: any): Promise<number> {
    // Chỉ admin mới có thể xem số lượng thanh toán
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không có quyền xem số lượng thanh toán');
    }

    return this.prisma.payment.count();
  }

  async getRevenue(currentUser: any): Promise<number> {
    // Chỉ admin mới có thể xem doanh thu
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không có quyền xem doanh thu');
    }

    const result = await this.prisma.order.aggregate({
      where: {
        status: 'COMPLETED',
        payments: {
          some: {
            status: 'SUCCESS',
          },
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount ? Number(result._sum.amount) : 0;
  }

  async getRevenueByPeriod(period: string, currentUser: any): Promise<{ data: { label: string; value: number }[] }> {
    // Chỉ admin mới có thể xem doanh thu
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không có quyền xem doanh thu');
    }

    // Validate period
    if (!['week', 'month', 'year'].includes(period)) {
      throw new BadRequestException('Period must be week, month, or year');
    }

    const now = new Date();
    let startDate: Date;
    let groupByFormat: string;
    let labels: string[];

    switch (period) {
      case 'week':
        // Last 7 days
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        groupByFormat = '%Y-%m-%d';
        labels = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - (6 - i));
          return date.toISOString().split('T')[0];
        });
        break;

      case 'month':
        // Last 12 months
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 11);
        startDate.setDate(1);
        groupByFormat = '%Y-%m';
        labels = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(now);
          date.setMonth(now.getMonth() - (11 - i));
          return date.toISOString().slice(0, 7);
        });
        break;

      case 'year':
        // Last 5 years
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 4);
        startDate.setMonth(0, 1);
        groupByFormat = '%Y';
        labels = Array.from({ length: 5 }, (_, i) => {
          const date = new Date(now);
          date.setFullYear(now.getFullYear() - (4 - i));
          return date.getFullYear().toString();
        });
        break;
    }

    // Đơn giản hóa query để lấy doanh thu từ Order và Payment
    const revenueData = await this.prisma.order.groupBy({
      by: ['created_at'],
      where: {
        status: 'COMPLETED',
        payments: {
          some: {
            status: 'SUCCESS'
          }
        },
        created_at: {
          gte: startDate
        }
      },
      _sum: {
        amount: true
      }
    });

    // Format data for response
    const formattedData = labels.map(label => {
      // Tìm doanh thu cho ngày/tháng/năm tương ứng
      const dataPoint = revenueData.find(d => {
        const date = new Date(d.created_at);
        switch (period) {
          case 'week':
            return date.toISOString().split('T')[0] === label;
          case 'month':
            return date.toISOString().slice(0, 7) === label;
          case 'year':
            return date.getFullYear().toString() === label;
        }
      });

      return {
        label: this.formatLabel(label, period),
        value: dataPoint?._sum.amount ? Number(dataPoint._sum.amount) : 0
      };
    });

    return { data: formattedData };
  }

  private formatLabel(label: string, period: string): string {
    switch (period) {
      case 'week':
        // Format: "DD/MM"
        const date = new Date(label);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      case 'month':
        // Format: "MM/YYYY"
        const [year, month] = label.split('-');
        return `${month}/${year}`;
      
      case 'year':
        // Format: "YYYY"
        return label;
      
      default:
        return label;
    }
  }

  async debugRevenue(currentUser: any): Promise<any> {
    // Chỉ admin mới có thể debug doanh thu
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không có quyền debug doanh thu');
    }

    // 1. Kiểm tra tất cả orders
    const allOrders = await this.prisma.order.findMany({
      include: {
        payments: true,
        user: true,
      },
      orderBy: { created_at: 'desc' },
    });

    // 2. Kiểm tra orders có status COMPLETED
    const completedOrders = allOrders.filter(order => order.status === 'COMPLETED');
    
    // 3. Kiểm tra payments có status SUCCESS
    const successPayments = await this.prisma.payment.findMany({
      where: {
        status: 'SUCCESS',
      },
      include: {
        order: true,
      },
    });

    // 4. Tính revenue theo cách hiện tại
    const currentRevenue = await this.prisma.order.aggregate({
      where: {
        status: 'COMPLETED',
        payments: {
          some: {
            status: 'SUCCESS',
          },
        },
      },
      _sum: {
        amount: true,
      },
    });

    // 5. Tính revenue từ payments SUCCESS (manual calculation)
    let manualRevenue = 0;
    for (const payment of successPayments) {
      if (payment.order) {
        manualRevenue += Number(payment.order.amount);
      }
    }

          return {
        debug: {
          totalOrders: allOrders.length,
          completedOrders: completedOrders.length,
          successPayments: successPayments.length,
          currentRevenueCalculation: currentRevenue._sum.amount ? Number(currentRevenue._sum.amount) : 0,
          manualRevenueCalculation: manualRevenue,
        allOrdersDetails: allOrders.map(order => ({
          id: order.id,
          status: order.status,
          amount: order.amount,
          user: order.user?.name,
          payments: order.payments.map(p => ({
            id: p.id,
            status: p.status,
            gateway: p.gateway,
            txn_code: p.txn_code,
            paid_at: p.paid_at,
          })),
        })),
        successPaymentsDetails: successPayments.map(payment => ({
          id: payment.id,
          order_id: payment.order_id,
          status: payment.status,
          gateway: payment.gateway,
          txn_code: payment.txn_code,
          paid_at: payment.paid_at,
          order_amount: payment.order?.amount,
        })),
      },
    };
  }

  async findById(id: number): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Thanh toán không tồn tại');
    }

    return payment;
  }

  async create(createPaymentDto: CreatePaymentDto, currentUser: any): Promise<PaymentResponseDto> {
    // Chỉ admin mới có thể tạo thanh toán
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không có quyền tạo thanh toán');
    }

    return this.prisma.payment.create({
      data: {
        order_id: createPaymentDto.order_id,
        gateway: createPaymentDto.gateway,
        status: createPaymentDto.status,
        txn_code: createPaymentDto.txn_code,
        paid_at: createPaymentDto.paid_at ? new Date(createPaymentDto.paid_at) : null,
      },
      include: {
        order: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto, currentUser: any): Promise<PaymentResponseDto> {
    // Chỉ admin mới có thể cập nhật thanh toán
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không có quyền cập nhật thanh toán');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Thanh toán không tồn tại');
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        gateway: updatePaymentDto.gateway,
        status: updatePaymentDto.status,
        txn_code: updatePaymentDto.txn_code,
        paid_at: updatePaymentDto.paid_at ? new Date(updatePaymentDto.paid_at) : undefined,
      },
      include: {
        order: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async delete(id: number, currentUser: any): Promise<{ message: string }> {
    // Chỉ admin mới có thể xóa thanh toán
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không có quyền xóa thanh toán');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Thanh toán không tồn tại');
    }

    await this.prisma.payment.delete({
      where: { id },
    });

    return { message: 'Thanh toán đã được xóa thành công' };
  }
} 