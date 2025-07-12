import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto, OrderResponseDto } from './dto/order.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // ===== PUBLIC METHODS =====

  async purchaseTickets(
    purchaseDto: {
      items: Array<{ ticketId: number; quantity: number }>;
      paymentMethod: string;
      promoCode?: string;
    },
    userId: string
  ): Promise<OrderResponseDto> {
    // Validate items
    if (!purchaseDto.items || purchaseDto.items.length === 0) {
      throw new BadRequestException('Items are required');
    }

    // Check ticket availability and calculate total
    let totalAmount = new Decimal(0);
    const orderItems = [];

    for (const item of purchaseDto.items) {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: item.ticketId },
      });

      if (!ticket) {
        throw new NotFoundException(`Ticket with ID ${item.ticketId} not found`);
      }

      if (!ticket.is_active) {
        throw new BadRequestException(`Ticket ${ticket.name} is not active`);
      }

      const remaining = ticket.total - ticket.sold;
      if (remaining < item.quantity) {
        throw new BadRequestException(`Not enough tickets available for ${ticket.name}`);
      }

      const itemTotal = ticket.price.mul(item.quantity);
      totalAmount = totalAmount.add(itemTotal);

      orderItems.push({
        ticket_id: item.ticketId,
        quantity: item.quantity,
        price_snapshot: ticket.price,
      });
    }

    // Apply promo code if provided
    let discountApplied = new Decimal(0);
    if (purchaseDto.promoCode) {
      const promoCode = await this.prisma.promoCode.findUnique({
        where: { code: purchaseDto.promoCode },
      });

      if (promoCode && promoCode.is_active && promoCode.uses < promoCode.max_uses) {
        if (promoCode.discount_type === 'PERCENTAGE') {
          discountApplied = totalAmount.mul(promoCode.discount_value).div(100);
        } else {
          discountApplied = promoCode.discount_value;
        }
        
        // Ensure discount doesn't exceed total
        if (discountApplied.greaterThan(totalAmount)) {
          discountApplied = totalAmount;
        }
      }
    }

    const finalAmount = totalAmount.sub(discountApplied);

    // Create order with transaction
    return this.prisma.$transaction(async (prisma) => {
      // Create order
      const order = await prisma.order.create({
        data: {
          user_id: userId,
          status: 'PENDING',
          payment_method: purchaseDto.paymentMethod,
          amount: finalAmount,
        },
        include: {
          user: true,
          order_items: {
            include: {
              ticket: true,
            },
          },
          payments: true,
        },
      });

      // Create order items
      for (const item of orderItems) {
        await prisma.orderItem.create({
          data: {
            order_id: order.id,
            ticket_id: item.ticket_id,
            quantity: item.quantity,
            price_snapshot: item.price_snapshot,
          },
        });

        // Update ticket sold count
        await prisma.ticket.update({
          where: { id: item.ticket_id },
          data: {
            sold: {
              increment: item.quantity,
            },
          },
        });
      }

      // Create payment record
      await prisma.payment.create({
        data: {
          order_id: order.id,
          gateway: purchaseDto.paymentMethod.toLowerCase(),
          status: 'PENDING',
        },
      });

      // Apply promo code if used
      if (purchaseDto.promoCode && discountApplied.greaterThan(0)) {
        const promoCode = await prisma.promoCode.findUnique({
          where: { code: purchaseDto.promoCode },
        });

        if (promoCode) {
          await prisma.orderPromo.create({
            data: {
              order_id: order.id,
              promo_code_id: promoCode.id,
              discount_applied: discountApplied,
            },
          });

          // Update promo code usage
          await prisma.promoCode.update({
            where: { id: promoCode.id },
            data: {
              uses: {
                increment: 1,
              },
            },
          });
        }
      }

      return order;
    });
  }

  async getUserOrders(userId: string): Promise<OrderResponseDto[]> {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      include: {
        user: true,
        order_items: {
          include: {
            ticket: true,
          },
        },
        payments: true,
        order_promos: {
          include: {
            promo_code: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getUserOrder(orderId: number, userId: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        user_id: userId,
      },
      include: {
        user: true,
        order_items: {
          include: {
            ticket: true,
          },
        },
        payments: true,
        order_promos: {
          include: {
            promo_code: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  async getPaymentStatus(orderId: number, userId: string): Promise<{
    orderId: number;
    status: string;
    paymentStatus: string;
    paidAt?: Date;
    transactionCode?: string;
  }> {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        user_id: userId,
      },
      include: {
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const payment = order.payments[0]; // Get the first payment record

    return {
      orderId: order.id,
      status: order.status,
      paymentStatus: payment?.status || 'PENDING',
      paidAt: payment?.paid_at,
      transactionCode: payment?.txn_code,
    };
  }

  // ===== ADMIN METHODS =====

  async findAll(): Promise<OrderResponseDto[]> {
    return this.prisma.order.findMany({
      include: {
        user: true,
        order_items: {
          include: {
            ticket: true,
          },
        },
        payments: true,
        order_promos: {
          include: {
            promo_code: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async count(): Promise<number> {
    return this.prisma.order.count();
  }

  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        order_items: {
          include: {
            ticket: true,
          },
        },
        payments: true,
        order_promos: {
          include: {
            promo_code: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.prisma.order.create({
      data: {
        user_id: createOrderDto.user_id,
        status: createOrderDto.status,
        payment_method: createOrderDto.payment_method,
        amount: new Decimal(createOrderDto.amount),
      },
      include: {
        user: true,
        order_items: {
          include: {
            ticket: true,
          },
        },
        payments: true,
      },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    // Check if order exists
    await this.findOne(id);

    const updateData: any = {};
    
    if (updateOrderDto.status !== undefined) {
      updateData.status = updateOrderDto.status;
    }
    if (updateOrderDto.payment_method !== undefined) {
      updateData.payment_method = updateOrderDto.payment_method;
    }
    if (updateOrderDto.amount !== undefined) {
      updateData.amount = new Decimal(updateOrderDto.amount);
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        order_items: {
          include: {
            ticket: true,
          },
        },
        payments: true,
      },
    });
  }

  async remove(id: number): Promise<void> {
    // Check if order exists
    await this.findOne(id);

    await this.prisma.order.delete({
      where: { id },
    });
  }
} 