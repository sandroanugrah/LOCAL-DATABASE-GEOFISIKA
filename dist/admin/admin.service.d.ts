import { ConfigService } from '@nestjs/config';
import { DeleteAdminDto } from '@/admin/dto/delete-admin.dto';
import { UpdateAdminDto } from '@/admin/dto/update-admin.dto';
import { RoleHelperService } from '@/helpers/role-helper.service';
import { TimeHelperService } from '@/helpers/time-helper.service';
import { ActivityLogService } from '@/activity-log/activity-log.service';
import { AdminUser, DeleteResponse, EditResponse } from '@/admin/admin.types';
export declare class AdminService {
    private configService;
    private timeHelperService;
    private roleHelperService;
    private activityLogService;
    private supabase;
    constructor(configService: ConfigService, timeHelperService: TimeHelperService, roleHelperService: RoleHelperService, activityLogService: ActivityLogService);
    private getAdminDataByRole;
    private getPartAdminDataByUserId;
    updateAdmin(updateAdminDto: UpdateAdminDto, ip_address: string, user_agent: string): Promise<EditResponse>;
    deleteAdmin({ user_id, id_role }: DeleteAdminDto, ip_address: string, user_agent: string): Promise<DeleteResponse>;
    getAdmin(): Promise<AdminUser[]>;
    getAdminDataByUserId(user_id: string): Promise<AdminUser>;
}
