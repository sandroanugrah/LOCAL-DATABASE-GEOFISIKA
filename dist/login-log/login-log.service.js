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
exports.LoginLogService = void 0;
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
dotenv.config();
let LoginLogService = class LoginLogService {
    configService;
    supabase;
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase URL atau Anon Key tidak ditemukan.');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async logLogin(dto) {
        const { admin_id, ip_address, user_agent } = dto;
        const login_time = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        const { data, error } = await this.supabase
            .from('login_log')
            .upsert([
            {
                admin_id,
                ip_address,
                user_agent,
                login_time: login_time,
            },
        ], { onConflict: 'admin_id' })
            .single();
        if (error) {
            console.error('Gagal menyimpan login log:', error.message);
            throw new Error(error.message);
        }
        return data;
    }
    async getAllLoginLog() {
        const { data, error } = await this.supabase.from('login_log').select('*');
        if (error) {
            console.error('Gagal mengambil data login log:', error.message);
            throw new Error(error.message);
        }
        return data;
    }
    async getLoginLogByUserId(user_id) {
        const { data, error } = await this.supabase
            .from('login_log')
            .select('*')
            .eq('admin_id', user_id);
        if (error) {
            console.error('Gagal mengambil data login log:', error.message);
            throw new Error(error.message);
        }
        return data;
    }
};
exports.LoginLogService = LoginLogService;
exports.LoginLogService = LoginLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LoginLogService);
//# sourceMappingURL=login-log.service.js.map