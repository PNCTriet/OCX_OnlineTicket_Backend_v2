import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto, TicketResponseDto } from './dto/ticket.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  // ===== PUBLIC METHODS =====

  async getAvailableTickets(eventId: number): Promise<TicketResponseDto[]> {
    return this.prisma.ticket.findMany({
      where: {
        event_id: eventId,
        is_active: true,
        // Chỉ lấy vé còn số lượng > 0 (total > sold)
        sold: {
          lt: this.prisma.ticket.fields.total,
        },
      },
      include: {
        event: true,
      },
      orderBy: { price: 'asc' },
    });
  }

  async checkAvailability(ticketId: number, quantity: number): Promise<{
    available: boolean;
    remaining: number;
    requested: number;
  }> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    if (!ticket.is_active) {
      throw new BadRequestException('Ticket is not active');
    }

    const remaining = ticket.total - ticket.sold;
    const available = remaining >= quantity;

    return {
      available,
      remaining,
      requested: quantity,
    };
  }

  // ===== ADMIN METHODS =====

  async findAll(): Promise<TicketResponseDto[]> {
    return this.prisma.ticket.findMany({
      include: {
        event: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async count(): Promise<number> {
    return this.prisma.ticket.count();
  }

  async findOne(id: number): Promise<TicketResponseDto> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async create(createTicketDto: CreateTicketDto): Promise<TicketResponseDto> {
    return this.prisma.ticket.create({
      data: {
        event_id: createTicketDto.event_id,
        name: createTicketDto.name,
        price: new Decimal(createTicketDto.price),
        type: createTicketDto.type,
        total: createTicketDto.total,
        sold: createTicketDto.sold || 0,
        start_sale_date: createTicketDto.start_sale_date ? new Date(createTicketDto.start_sale_date) : null,
        end_sale_date: createTicketDto.end_sale_date ? new Date(createTicketDto.end_sale_date) : null,
        is_active: createTicketDto.is_active !== undefined ? createTicketDto.is_active : true,
      },
      include: {
        event: true,
      },
    });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<TicketResponseDto> {
    // Check if ticket exists
    await this.findOne(id);

    const { price, ...data } = updateTicketDto;
    const updateData: any = { ...data };
    
    if (price !== undefined) {
      updateData.price = new Decimal(price);
    }

    return this.prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        event: true,
      },
    });
  }

  async remove(id: number): Promise<void> {
    // Check if ticket exists
    await this.findOne(id);

    await this.prisma.ticket.delete({
      where: { id },
    });
  }
} 