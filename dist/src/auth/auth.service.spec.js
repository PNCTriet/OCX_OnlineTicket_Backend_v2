"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const nestjs_i18n_1 = require("nestjs-i18n");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../common/prisma/prisma.service");
const supabase_service_1 = require("../common/supabase/supabase.service");
const common_1 = require("@nestjs/common");
describe('AuthService', () => {
    let service;
    let prismaService;
    let supabaseService;
    let jwtService;
    let i18nService;
    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };
    const mockSupabaseService = {
        getClient: jest.fn(),
    };
    const mockJwtService = {
        sign: jest.fn(),
    };
    const mockI18nService = {
        translate: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: supabase_service_1.SupabaseService,
                    useValue: mockSupabaseService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: nestjs_i18n_1.I18nService,
                    useValue: mockI18nService,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        prismaService = module.get(prisma_service_1.PrismaService);
        supabaseService = module.get(supabase_service_1.SupabaseService);
        jwtService = module.get(jwt_1.JwtService);
        i18nService = module.get(nestjs_i18n_1.I18nService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('register', () => {
        const registerDto = {
            email: 'test@example.com',
            name: 'Test User',
            password: 'password123',
            phone: '1234567890',
        };
        it('should throw ConflictException if email already exists', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });
            mockI18nService.translate.mockResolvedValue('Email already exists');
            await expect(service.register(registerDto)).rejects.toThrow(common_1.ConflictException);
        });
        it('should create user successfully', async () => {
            const mockSupabaseClient = {
                auth: {
                    admin: {
                        createUser: jest.fn().mockResolvedValue({
                            data: { user: { id: 'supabase-user-id' } },
                            error: null,
                        }),
                    },
                },
            };
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);
            mockPrismaService.user.create.mockResolvedValue({
                id: 'user-id',
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
                is_verified: true,
            });
            mockJwtService.sign.mockReturnValue('jwt-token');
            const result = await service.register(registerDto);
            expect(result).toHaveProperty('accessToken', 'jwt-token');
            expect(result.user).toHaveProperty('email', 'test@example.com');
        });
    });
    describe('login', () => {
        const loginDto = {
            email: 'test@example.com',
            password: 'password123',
        };
        it('should throw UnauthorizedException for invalid credentials', async () => {
            const mockSupabaseClient = {
                auth: {
                    signInWithPassword: jest.fn().mockResolvedValue({
                        data: null,
                        error: { message: 'Invalid credentials' },
                    }),
                },
            };
            mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);
            mockI18nService.translate.mockResolvedValue('Invalid credentials');
            await expect(service.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException);
        });
        it('should login successfully', async () => {
            const mockSupabaseClient = {
                auth: {
                    signInWithPassword: jest.fn().mockResolvedValue({
                        data: { user: { id: 'supabase-user-id' } },
                        error: null,
                    }),
                },
            };
            mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'user-id',
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
                is_verified: true,
            });
            mockJwtService.sign.mockReturnValue('jwt-token');
            const result = await service.login(loginDto);
            expect(result).toHaveProperty('accessToken', 'jwt-token');
            expect(result.user).toHaveProperty('email', 'test@example.com');
        });
    });
    describe('validateUser', () => {
        it('should return user if found', async () => {
            const mockUser = {
                id: 'user-id',
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            const result = await service.validateUser('user-id');
            expect(result).toEqual(mockUser);
        });
        it('should throw UnauthorizedException if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockI18nService.translate.mockResolvedValue('User not found');
            await expect(service.validateUser('invalid-id')).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map