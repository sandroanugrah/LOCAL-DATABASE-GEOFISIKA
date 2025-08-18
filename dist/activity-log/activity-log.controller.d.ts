import { ActivityLogService } from '@/activity-log/activity-log.service';
import { CreateActivityLogDto } from '@/activity-log/dto/create-activity-log.dto';
export declare class ActivityLogController {
    private readonly activityLogService;
    constructor(activityLogService: ActivityLogService);
    createLog(dto: CreateActivityLogDto): Promise<null>;
    getAllLog(): Promise<any[] | null>;
    getLogByUserId(user_id: string): Promise<any[] | null>;
}
