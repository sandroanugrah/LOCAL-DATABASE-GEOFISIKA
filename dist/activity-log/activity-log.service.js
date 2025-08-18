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
exports.ActivityLogService = void 0;
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const time_helper_service_1 = require("../helpers/time-helper.service");
const supabase_js_1 = require("@supabase/supabase-js");
dotenv.config();
let ActivityLogService = class ActivityLogService {
    configService;
    timeHelperService;
    supabase;
    constructor(configService, timeHelperService) {
        this.configService = configService;
        this.timeHelperService = timeHelperService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase URL atau Anon Key tidak ditemukan.');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async logActivity(dto) {
        const { admin_id, action, description, ip_address, user_agent } = dto;
        const timeZone = 'Asia/Jakarta';
        const date = new Date();
        const formattedCreatedAt = this.timeHelperService.formatCreatedAt(date, timeZone);
        const { data, error } = await this.supabase.from('activity_log').insert([
            {
                admin_id,
                action,
                description,
                ip_address,
                user_agent,
                created_at: formattedCreatedAt,
            },
        ]);
        if (error) {
            console.error('Gagal menyimpan activity log:', error.message);
        }
        return data;
    }
    async getAllActivityLog() {
        const { data, error } = await this.supabase
            .from('activity_log')
            .select('*');
        if (error) {
            console.error('Gagal mengambil data activity log:', error.message);
        }
        return data;
    }
    async getActivityLogByUserId(user_id) {
        const { data, error } = await this.supabase
            .from('activity_log')
            .select('*')
            .eq('admin_id', user_id);
        if (error) {
            console.error('Gagal mengambil data activity log:', error.message);
        }
        return data;
    }
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        time_helper_service_1.TimeHelperService])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map