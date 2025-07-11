import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { AuthService } from './auth.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SupabaseService } from '@/common/supabase/supabase.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let supabaseService: SupabaseService;
  let jwtService: JwtService;
  let i18nService: I18nService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
    jwtService = module.get<JwtService>(JwtService);
    i18nService = module.get<I18nService>(I18nService);

    // Reset mocks
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

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
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

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
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

      await expect(service.validateUser('invalid-id')).rejects.toThrow(UnauthorizedException);
    });
  });
}); 