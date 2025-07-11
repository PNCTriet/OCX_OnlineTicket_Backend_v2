import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, lang: string): Promise<AuthResponseDto>;
    login(loginDto: LoginDto, lang: string): Promise<AuthResponseDto>;
}
