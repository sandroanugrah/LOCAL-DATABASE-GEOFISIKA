import { ConfigService } from '@nestjs/config';
import { TimeHelperService } from '@/helpers/time-helper.service';
import { CreateActivityLogDto } from '@/activity-log/dto/create-activity-log.dto';
export declare class ActivityLogService {
    private configService;
    private timeHelperService;
    private supabase;
    constructor(configService: ConfigService, timeHelperService: TimeHelperService);
    logActivity(dto: CreateActivityLogDto): Promise<null>;
    getAllActivityLog(): Promise<any[] | null>;
    getActivityLogByUserId(user_id: string): Promise<any[] | null>;
}
