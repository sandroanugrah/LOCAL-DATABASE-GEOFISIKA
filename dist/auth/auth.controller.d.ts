import { Request } from 'express';
import { LoginDto } from '@/auth/dto/login.dto';
import { AuthService } from '@/auth/auth.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import { SignUpResponse, SignInResponse } from '@/auth/auth.types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(id_role: string, registerDto: RegisterDto, req: Request): Promise<SignUpResponse>;
    login(loginDto: LoginDto, req: Request): Promise<SignInResponse>;
    logout(): Promise<{
        message: string;
    }>;
}
