import { ConfigService } from '@nestjs/config';
import { CreateLoginLogDto } from '@/login-log/dto/create-login-log.dto';
export declare class LoginLogService {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    logLogin(dto: CreateLoginLogDto): Promise<never>;
    getAllLoginLog(): Promise<any[]>;
    getLoginLogByUserId(user_id: string): Promise<any[]>;
}
