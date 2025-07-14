import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto, EventResponseDto } from './dto/event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    getPublicEvents(): Promise<EventResponseDto[]>;
    getPublicEvent(id: string): Promise<EventResponseDto>;
    findAll(): Promise<EventResponseDto[]>;
    count(): Promise<number>;
    findOne(id: string): Promise<EventResponseDto>;
    create(createEventDto: CreateEventDto): Promise<EventResponseDto>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<EventResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
