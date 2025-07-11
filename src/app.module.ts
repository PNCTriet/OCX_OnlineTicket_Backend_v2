import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import supabaseConfig from './config/supabase.config';
import jwtConfig from './config/jwt.config';
import { PrismaModule } from './common/prisma/prisma.module';
import { SupabaseModule } from './common/supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { I18nConfigModule } from './common/i18n/i18n.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, supabaseConfig, jwtConfig],
    }),
    PrismaModule,
    SupabaseModule,
    I18nConfigModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {} 