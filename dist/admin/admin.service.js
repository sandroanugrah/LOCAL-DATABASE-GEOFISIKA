"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const uuid_1 = require("uuid");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const role_helper_service_1 = require("../helpers/role-helper.service");
const time_helper_service_1 = require("../helpers/time-helper.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let AdminService = class AdminService {
    configService;
    timeHelperService;
    roleHelperService;
    activityLogService;
    supabase;
    constructor(configService, timeHelperService, roleHelperService, activityLogService) {
        this.configService = configService;
        this.timeHelperService = timeHelperService;
        this.roleHelperService = roleHelperService;
        this.activityLogService = activityLogService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_KEY');
        const supabaseRoleKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY');
        if (!supabaseUrl || !supabaseKey || !supabaseRoleKey) {
            throw new Error('Supabase URL atau Service Role Key tidak ditemukan.');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseRoleKey);
    }
    async getAdminDataByRole(id_role) {
        const { data, error } = await this.supabase
            .from('admin')
            .select('first_name, last_name')
            .eq('user_id', id_role)
            .limit(1);
        if (error)
            throw new common_1.BadRequestException(error.message);
        if (!data?.length)
            throw new common_1.BadRequestException('Admin tidak ditemukan berdasarkan id_role.');
        return data[0];
    }
    async getPartAdminDataByUserId(user_id) {
        const { data, error } = await this.supabase
            .from('admin')
            .select('first_name, last_name, role')
            .eq('user_id', user_id)
            .limit(1);
        if (error)
            throw new common_1.BadRequestException(error.message);
        if (!data?.length)
            throw new common_1.BadRequestException('Admin tidak ditemukan berdasarkan user_id.');
        return data[0];
    }
    async updateAdmin(updateAdminDto, ip_address, user_agent) {
        const { user_id, id_role, email, password, first_name, last_name, file_base64, role, } = updateAdminDto;
        const { data: userData, error: fetchError } = await this.supabase
            .from('admin')
            .select('*')
            .eq('user_id', user_id)
            .single();
        if (fetchError || !userData) {
            throw new common_1.BadRequestException('User tidak ditemukan.');
        }
        const { error: updateAuthError } = await this.supabase.auth.admin.updateUserById(user_id, {
            email,
            password,
            user_metadata: {
                first_name,
                last_name,
                full_name: `${first_name} ${last_name}`,
            },
        });
        if (updateAuthError) {
            throw new common_1.BadRequestException('Gagal memperbarui data pengguna di Supabase Auth.');
        }
        const bucketName = 'admin';
        let photo = userData.photo;
        if (file_base64) {
            if (userData.photo) {
                const oldFilePath = userData.photo.split('/').pop();
                await this.supabase.storage.from(bucketName).remove([oldFilePath]);
            }
            const newFileName = `${(0, uuid_1.v4)()}.jpg`;
            const base64Data = file_base64.replace(/^data:image\/\w+;base64,/, '');
            const fileBuffer = buffer_1.Buffer.from(base64Data, 'base64');
            const { error: uploadError } = await this.supabase.storage
                .from(bucketName)
                .upload(newFileName, fileBuffer, {
                contentType: 'image/jpeg',
            });
            if (uploadError) {
                throw new common_1.BadRequestException('Gagal mengunggah foto baru ke storage.');
            }
            const { data: publicUrlData } = this.supabase.storage
                .from(bucketName)
                .getPublicUrl(newFileName);
            photo = publicUrlData.publicUrl;
        }
        const { error: updateAdminError } = await this.supabase
            .from('admin')
            .update({
            email,
            first_name,
            last_name,
            photo,
            role,
        })
            .eq('user_id', user_id);
        if (updateAdminError) {
            throw new common_1.BadRequestException('Gagal memperbarui data admin di tabel admin.');
        }
        const target = await this.getPartAdminDataByUserId(user_id);
        const admin = await this.getAdminDataByRole(id_role);
        const updaterName = `${admin.first_name} ${admin.last_name}`;
        const roleTarget = this.roleHelperService.formatRole(target.role);
        const timeZone = 'Asia/Jakarta';
        const date = new Date();
        const formattedCreatedAt = this.timeHelperService.formatCreatedAt(date, timeZone);
        await this.activityLogService.logActivity({
            admin_id: id_role,
            action: `Memperbarui Data ${roleTarget}`,
            description: `${updaterName} memperbarui data admin ${first_name} ${last_name}.`,
            ip_address,
            user_agent,
            created_at: formattedCreatedAt,
        });
        const updatedAdmin = {
            id: userData.id,
            email,
            first_name,
            last_name,
            photo: userData.photo,
            role: userData.role,
            user_id: userData.user_id,
        };
        return {
            user: updatedAdmin,
            status: 'success',
        };
    }
    async deleteAdmin({ user_id, id_role }, ip_address, user_agent) {
        const bucketName = 'admin';
        const { data: userData, error: fetchError } = await this.supabase
            .from('admin')
            .select('*')
            .eq('user_id', user_id)
            .single();
        if (fetchError || !userData) {
            throw new common_1.BadRequestException('User tidak ditemukan.');
        }
        if (userData.photo) {
            const fileName = userData.photo.split('/').pop();
            await this.supabase.storage.from(bucketName).remove([fileName]);
        }
        const admin = await this.getAdminDataByRole(id_role);
        const deleterName = `${admin.first_name} ${admin.last_name}`;
        const target = await this.getPartAdminDataByUserId(user_id);
        const targetName = `${target.first_name} ${target.last_name}`;
        const role = this.roleHelperService.formatRole(target.role);
        const timeZone = 'Asia/Jakarta';
        const date = new Date();
        const formattedCreatedAt = this.timeHelperService.formatCreatedAt(date, timeZone);
        await this.activityLogService.logActivity({
            admin_id: id_role,
            action: `Menghapus ${role}`,
            description: `${deleterName} menghapus ${targetName} dari database.`,
            ip_address,
            user_agent,
            created_at: formattedCreatedAt,
        });
        const { error: deleteError } = await this.supabase.auth.admin.deleteUser(user_id);
        if (deleteError) {
            throw new common_1.BadRequestException('Gagal menghapus user dari Supabase Auth.');
        }
        const adminUser = {
            id: userData.id,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            photo: userData.photo,
            role: userData.role,
            user_id: userData.user_id,
        };
        return {
            user: adminUser,
            status: 'success',
        };
    }
    async getAdmin() {
        const { data, error } = await this.supabase
            .from('admin')
            .select('id, email, first_name, last_name, photo, role, user_id');
        if (error) {
            throw new common_1.BadRequestException('Gagal mengambil data admin: ' + error.message);
        }
        return data;
    }
    async getAdminDataByUserId(user_id) {
        const { data, error } = await this.supabase
            .from('admin')
            .select('id, email, first_name, last_name, photo, role, user_id')
            .eq('user_id', user_id)
            .single();
        if (error) {
            throw new common_1.BadRequestException('Gagal mengambil data admin: ' + error.message);
        }
        return data;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        time_helper_service_1.TimeHelperService,
        role_helper_service_1.RoleHelperService,
        activity_log_service_1.ActivityLogService])
], AdminService);
//# sourceMappingURL=admin.service.js.map