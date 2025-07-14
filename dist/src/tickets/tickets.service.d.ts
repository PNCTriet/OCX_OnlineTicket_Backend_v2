import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto, TicketResponseDto } from './dto/ticket.dto';
export declare class TicketsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAvailableTickets(eventId: number): Promise<TicketResponseDto[]>;
    checkAvailability(ticketId: number, quantity: number): Promise<{
        available: boolean;
        remaining: number;
        requested: number;
    }>;
    findAll(): Promise<TicketResponseDto[]>;
    count(): Promise<number>;
    findOne(id: number): Promise<TicketResponseDto>;
    create(createTicketDto: CreateTicketDto): Promise<TicketResponseDto>;
    update(id: number, updateTicketDto: UpdateTicketDto): Promise<TicketResponseDto>;
    remove(id: number): Promise<void>;
}
