import { LoginLogService } from '@/login-log/login-log.service';
import { CreateLoginLogDto } from '@/login-log/dto/create-login-log.dto';
export declare class LoginLogController {
    private readonly loginLogService;
    constructor(loginLogService: LoginLogService);
    createLog(dto: CreateLoginLogDto): Promise<never>;
    getAllLog(): Promise<any[]>;
    getLogByUserId(user_id: string): Promise<any[]>;
}
