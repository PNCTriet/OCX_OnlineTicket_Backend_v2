export declare class CreateOrganizationDto {
    name: string;
    contact_email?: string;
    phone?: string;
    address?: string;
}
export declare class UpdateOrganizationDto {
    name?: string;
    contact_email?: string;
    phone?: string;
    address?: string;
}
export declare class OrganizationResponseDto {
    id: number;
    name: string;
    contact_email?: string;
    phone?: string;
    address?: string;
    created_at: Date;
    updated_at: Date;
}
