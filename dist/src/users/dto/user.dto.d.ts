import { UserRole } from '@prisma/client';
export declare class UserResponseDto {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    is_verified: boolean;
    phone?: string;
    avatar_url?: string;
    created_at: Date;
    updated_at: Date;
}
export declare class UpdateUserDto {
    name?: string;
    phone?: string;
    avatar_url?: string;
}
