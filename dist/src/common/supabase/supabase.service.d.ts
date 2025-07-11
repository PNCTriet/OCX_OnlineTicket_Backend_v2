import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    getClient(): SupabaseClient;
    getUserById(userId: string): Promise<import("@supabase/supabase-js").AuthUser>;
    verifyToken(token: string): Promise<import("@supabase/supabase-js").AuthUser>;
}
