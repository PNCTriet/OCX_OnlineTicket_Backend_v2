import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateEventDto, UpdateEventDto, EventResponseDto } from './dto/event.dto';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    getPublicEvents(): Promise<EventResponseDto[]>;
    getPublicEvent(id: number): Promise<EventResponseDto>;
    findAll(): Promise<EventResponseDto[]>;
    count(): Promise<number>;
    findOne(id: number): Promise<EventResponseDto>;
    create(createEventDto: CreateEventDto): Promise<EventResponseDto>;
    update(id: number, updateEventDto: UpdateEventDto): Promise<EventResponseDto>;
    remove(id: number): Promise<void>;
}
