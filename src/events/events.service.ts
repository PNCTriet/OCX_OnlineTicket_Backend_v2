import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateEventDto, UpdateEventDto, EventResponseDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  // ===== PUBLIC METHODS =====

  async getPublicEvents(): Promise<EventResponseDto[]> {
    return this.prisma.event.findMany({
      where: {
        // Chỉ lấy sự kiện trong tương lai
        date: {
          gte: new Date(),
        },
      },
      include: {
        organization: true,
        tickets: {
          where: {
            is_active: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getPublicEvent(id: number): Promise<EventResponseDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organization: true,
        tickets: {
          where: {
            is_active: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  // ===== ADMIN METHODS =====

  async findAll(): Promise<EventResponseDto[]> {
    return this.prisma.event.findMany({
      include: {
        organization: true,
        tickets: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async count(): Promise<number> {
    return this.prisma.event.count();
  }

  async findOne(id: number): Promise<EventResponseDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organization: true,
        tickets: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async create(createEventDto: CreateEventDto): Promise<EventResponseDto> {
    const { date, ...data } = createEventDto;
    
    return this.prisma.event.create({
      data: {
        ...data,
        date: new Date(date),
      },
      include: {
        organization: true,
        tickets: true,
      },
    });
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<EventResponseDto> {
    // Check if event exists
    await this.findOne(id);

    const { date, ...data } = updateEventDto;
    const updateData: any = { ...data };
    
    if (date !== undefined) {
      updateData.date = new Date(date);
    }

    return this.prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        organization: true,
        tickets: true,
      },
    });
  }

  async remove(id: number): Promise<void> {
    // Check if event exists
    await this.findOne(id);

    await this.prisma.event.delete({
      where: { id },
    });
  }
} 