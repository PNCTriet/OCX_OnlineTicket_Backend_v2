"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const nestjs_i18n_1 = require("nestjs-i18n");
const prisma_service_1 = require("../common/prisma/prisma.service");
const supabase_service_1 = require("../common/supabase/supabase.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, supabase, jwtService, i18n) {
        this.prisma = prisma;
        this.supabase = supabase;
        this.jwtService = jwtService;
        this.i18n = i18n;
    }
    async register(registerDto, lang = 'en') {
        const { email, name, password, phone } = registerDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException(await this.i18n.translate('common.auth.register.email_exists', { lang }));
        }
        const supabaseClient = this.supabase.getClient();
        const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });
        if (authError) {
            throw new common_1.UnauthorizedException(await this.i18n.translate('common.auth.register.supabase_error', { lang }));
        }
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                phone,
                supabase_id: authData.user.id,
                role: client_1.UserRole.USER,
                is_verified: true,
            },
        });
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
    async login(loginDto, lang = 'en') {
        const { email, password } = loginDto;
        const supabaseClient = this.supabase.getClient();
        const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });
        if (authError) {
            throw new common_1.UnauthorizedException(await this.i18n.translate('common.auth.login.invalid_credentials', { lang }));
        }
        const user = await this.prisma.user.findUnique({
            where: { supabase_id: authData.user.id },
        });
        if (!user) {
            throw new common_1.UnauthorizedException(await this.i18n.translate('common.auth.login.user_not_found', { lang }));
        }
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
    async validateUser(userId, lang = 'en') {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException(await this.i18n.translate('common.auth.validation.user_not_found', { lang }));
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_service_1.SupabaseService,
        jwt_1.JwtService,
        nestjs_i18n_1.I18nService])
], AuthService);
//# sourceMappingURL=auth.service.js.map