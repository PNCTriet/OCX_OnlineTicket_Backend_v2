import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SupabaseService } from '@/common/supabase/supabase.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private supabase;
    private jwtService;
    private i18n;
    constructor(prisma: PrismaService, supabase: SupabaseService, jwtService: JwtService, i18n: I18nService);
    register(registerDto: RegisterDto, lang?: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            is_verified: boolean;
        };
    }>;
    login(loginDto: LoginDto, lang?: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            is_verified: boolean;
        };
    }>;
    validateUser(userId: string, lang?: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        is_verified: boolean;
        supabase_id: string | null;
        phone: string | null;
        avatar_url: string | null;
    }>;
}
