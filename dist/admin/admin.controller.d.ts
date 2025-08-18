import { Request } from 'express';
import { AdminService } from '@/admin/admin.service';
import { DeleteAdminDto } from '@/admin/dto/delete-admin.dto';
import { UpdateAdminDto } from '@/admin/dto/update-admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    updateAdmin(querys: UpdateAdminDto, updateAdminDto: UpdateAdminDto, req: Request): Promise<import("./admin.types").EditResponse>;
    deleteAdmin(querys: DeleteAdminDto, req: Request): Promise<import("./admin.types").DeleteResponse>;
    getAdminData(): Promise<import("./admin.types").AdminUser[]>;
    getAdminDataByUserId(user_id: string): Promise<import("./admin.types").AdminUser>;
}
