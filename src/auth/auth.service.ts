import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SupabaseService } from '@/common/supabase/supabase.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
    private jwtService: JwtService,
    private i18n: I18nService,
  ) {}

  async register(registerDto: RegisterDto, lang: string = 'en') {
    const { email, name, password, phone } = registerDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(await this.i18n.translate('common.auth.register.email_exists', { lang }));
    }

    // Tạo user trong Supabase
    const supabaseClient = this.supabase.getClient();
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      throw new UnauthorizedException(await this.i18n.translate('common.auth.register.supabase_error', { lang }));
    }

    // Tạo user trong local database
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        phone,
        supabase_id: authData.user.id,
        role: UserRole.USER,
        is_verified: true,
      },
    });

    // Tạo access token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_verified: user.is_verified,
      },
    };
  }

  async login(loginDto: LoginDto, lang: string = 'en') {
    const { email, password } = loginDto;

    // Xác thực với Supabase
    const supabaseClient = this.supabase.getClient();
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new UnauthorizedException(await this.i18n.translate('common.auth.login.invalid_credentials', { lang }));
    }

    // Lấy thông tin user từ local database
    const user = await this.prisma.user.findUnique({
      where: { supabase_id: authData.user.id },
    });

    if (!user) {
      throw new UnauthorizedException(await this.i18n.translate('common.auth.login.user_not_found', { lang }));
    }

    // Tạo access token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_verified: user.is_verified,
      },
    };
  }

  async validateUser(userId: string, lang: string = 'en') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException(await this.i18n.translate('common.auth.validation.user_not_found', { lang }));
    }

    return user;
  }
} 