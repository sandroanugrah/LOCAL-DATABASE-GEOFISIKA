import { ConfigService } from '@nestjs/config';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginLogService } from '@/login-log/login-log.service';
import { TimeHelperService } from '@/helpers/time-helper.service';
import { ActivityLogService } from '@/activity-log/activity-log.service';
import { SignInResponse, SignUpResponse } from '@/auth/auth.types';
export declare class AuthService {
    private configService;
    private LoginLogService;
    private timeHelperService;
    private activityLogService;
    private supabase;
    constructor(configService: ConfigService, LoginLogService: LoginLogService, timeHelperService: TimeHelperService, activityLogService: ActivityLogService);
    private getRoleByUserId;
    private getAdminDataByRole;
    signUp(registerDto: RegisterDto, id_role: string, ip_address: string, user_agent: string): Promise<SignUpResponse>;
    signIn(loginDto: LoginDto, ip_address: string, user_agent: string): Promise<SignInResponse>;
    logout(): Promise<{
        message: string;
    }>;
}
