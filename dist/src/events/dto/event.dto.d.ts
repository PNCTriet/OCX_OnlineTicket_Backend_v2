export declare class CreateEventDto {
    organization_id: number;
    name: string;
    description?: string;
    date: string;
    location?: string;
}
export declare class UpdateEventDto {
    name?: string;
    description?: string;
    date?: string;
    location?: string;
}
export declare class EventResponseDto {
    id: number;
    organization_id: number;
    name: string;
    description: string;
    date: Date;
    location: string;
    created_at: Date;
    updated_at: Date;
    organization?: any;
    tickets?: any[];
}
