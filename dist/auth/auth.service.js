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
exports.AuthService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const uuid_1 = require("uuid");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const login_log_service_1 = require("../login-log/login-log.service");
const time_helper_service_1 = require("../helpers/time-helper.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let AuthService = class AuthService {
    configService;
    LoginLogService;
    timeHelperService;
    activityLogService;
    supabase;
    constructor(configService, LoginLogService, timeHelperService, activityLogService) {
        this.configService = configService;
        this.LoginLogService = LoginLogService;
        this.timeHelperService = timeHelperService;
        this.activityLogService = activityLogService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase URL atau Anon Key tidak ditemukan.');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async getRoleByUserId(userId) {
        const { data, error } = await this.supabase
            .from('admin')
            .select('role')
            .eq('user_id', userId)
            .single();
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        if (!data) {
            throw new common_1.BadRequestException('Role pengguna tidak ditemukan.');
        }
        return data.role;
    }
    async getAdminDataByRole(id_role) {
        const { data, error } = await this.supabase
            .from('admin')
            .select('first_name, last_name')
            .eq('user_id', id_role)
            .single();
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        if (!data) {
            throw new common_1.BadRequestException('Data admin tidak ditemukan berdasarkan id_role.');
        }
        return data;
    }
    async signUp(registerDto, id_role, ip_address, user_agent) {
        const { email, password, first_name, last_name, file_base64, role } = registerDto;
        const fullName = `${first_name} ${last_name}`;
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        const user = data?.user;
        if (!user) {
            throw new common_1.BadRequestException('Gagal mendapatkan informasi pengguna.');
        }
        const adminData = await this.getAdminDataByRole(id_role);
        const firstNameFromDB = adminData.first_name;
        const lastNameFromDB = adminData.last_name;
        const timeZone = 'Asia/Jakarta';
        const date = new Date();
        const formattedCreatedAt = this.timeHelperService.formatCreatedAt(date, timeZone);
        await this.activityLogService.logActivity({
            admin_id: id_role,
            action: 'Mendaftarkan Admin Atau Operator',
            description: `${firstNameFromDB} ${lastNameFromDB} mendaftarkan ${first_name} ${last_name} dengan email ${email}`,
            ip_address,
            user_agent,
            created_at: formattedCreatedAt,
        });
        const fileName = `${(0, uuid_1.v4)()}.jpg`;
        const bucketName = 'admin';
        const base64Data = file_base64.replace(/^data:image\/\w+;base64,/, '');
        const fileBuffer = buffer_1.Buffer.from(base64Data, 'base64');
        const { error: uploadError } = await this.supabase.storage
            .from(bucketName)
            .upload(fileName, fileBuffer, {
            contentType: 'image/jpeg',
            upsert: true,
        });
        if (uploadError) {
            throw new common_1.BadRequestException('Gagal mengunggah foto ke storage: ' + uploadError.message);
        }
        const { data: publicUrlData } = this.supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
        const photo = publicUrlData.publicUrl;
        const { data: dbData, error: dbError } = await this.supabase
            .from('admin')
            .insert([
            {
                email,
                first_name,
                last_name,
                photo,
                role,
                user_id: user.id,
            },
        ])
            .select()
            .single();
        if (dbError) {
            throw new common_1.BadRequestException(dbError.message);
        }
        if (!dbData) {
            throw new common_1.BadRequestException('Gagal menyimpan data ke tabel admin.');
        }
        return {
            message: `${role} berhasil didaftarkan`,
            user: dbData,
        };
    }
    async signIn(loginDto, ip_address, user_agent) {
        const { email, password } = loginDto;
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        const user = data?.user;
        const session = data?.session;
        if (!user || !session) {
            throw new common_1.BadRequestException('Gagal login, data tidak ditemukan.');
        }
        const role = await this.getRoleByUserId(user.id);
        const login_time = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.LoginLogService.logLogin({
            admin_id: user.id,
            ip_address,
            user_agent,
            login_time: login_time,
        });
        return {
            message: 'Login berhasil',
            user_id: user.id,
            access_token: session.access_token,
            role: role,
        };
    }
    async logout() {
        return {
            message: 'Logout berhasil',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        login_log_service_1.LoginLogService,
        time_helper_service_1.TimeHelperService,
        activity_log_service_1.ActivityLogService])
], AuthService);
//# sourceMappingURL=auth.service.js.map