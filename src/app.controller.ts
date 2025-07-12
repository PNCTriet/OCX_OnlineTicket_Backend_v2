import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PrismaService } from '@/common/prisma/prisma.service';

@ApiTags('📊 Dashboard')
@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('api/dashboard/stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thống kê tổng quan cho dashboard' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thống kê tổng quan',
    type: Object 
  })
  async getDashboardStats() {
    const [
      totalUsers,
      totalEvents,
      totalTickets,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.event.count(),
      this.prisma.ticket.count(),
      this.prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.order.findMany({
        take: 5,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          order_items: {
            include: {
              ticket: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    return {
      totalUsers,
      totalEvents,
      totalTickets,
      totalRevenue: totalRevenue._sum.amount || 0,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        status: order.status,
        amount: order.amount,
        createdAt: order.created_at,
        user: order.user,
        items: order.order_items.map(item => ({
          ticketName: item.ticket.name,
          quantity: item.quantity,
          price: item.price_snapshot,
        })),
      })),
    };
  }

  @Get('api/health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
} 