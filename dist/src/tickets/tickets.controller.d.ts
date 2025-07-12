import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto, TicketResponseDto } from './dto/ticket.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    getAvailableTickets(eventId: string): Promise<TicketResponseDto[]>;
    checkAvailability(body: {
        ticketId: number;
        quantity: number;
    }): Promise<{
        available: boolean;
        remaining: number;
        requested: number;
    }>;
    findAll(): Promise<TicketResponseDto[]>;
    count(): Promise<number>;
    findOne(id: string): Promise<TicketResponseDto>;
    create(createTicketDto: CreateTicketDto): Promise<TicketResponseDto>;
    update(id: string, updateTicketDto: UpdateTicketDto): Promise<TicketResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
