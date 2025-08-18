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
exports.MicrothermorService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const activity_log_service_1 = require("../activity-log/activity-log.service");
let MicrothermorService = class MicrothermorService {
    configService;
    activityLogService;
    supabase;
    constructor(configService, activityLogService) {
        this.configService = configService;
        this.activityLogService = activityLogService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase URL atau Anon Key tidak ditemukan.');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async getAdminData(user_id) {
        const { data, error } = await this.supabase
            .from('admin')
            .select('first_name, last_name')
            .eq('user_id', user_id)
            .single();
        if (error || !data) {
            return { success: false, message: 'Gagal mengambil data admin', error };
        }
        return { success: true, data };
    }
    async saveMicrothermor(dto, ipAddress, userAgent) {
        const { user_id, latitude, longitude, FO, AO, TDOM, KG } = dto;
        const adminResponse = await this.getAdminData(user_id);
        if (!adminResponse.success || !adminResponse.data) {
            return {
                success: false,
                message: 'Data admin tidak ditemukan',
                error: adminResponse.error,
            };
        }
        const { first_name, last_name } = adminResponse.data;
        const namaAdmin = `${first_name} ${last_name}`;
        const { data: insertedMicrothermor, error: microthermorError } = await this.supabase
            .from('microthermor')
            .insert({
            latitude,
            longitude,
            FO,
            AO,
            TDOM,
            KG,
        })
            .select()
            .single();
        if (microthermorError) {
            return {
                success: false,
                message: 'Gagal menyimpan data mikrotermor',
                error: microthermorError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Penguapan',
            description: `${namaAdmin} menambahkan data mikrotermor dengan latitude ${latitude}, longitude ${longitude}, FO ${FO}, AO ${AO}, TDOM ${TDOM}, dan KG ${KG}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data mikrotermor',
            data: insertedMicrothermor,
        };
    }
    async updateMicrothermor(dto, ipAddress, userAgent) {
        const { id, user_id, latitude, longitude, FO, AO, TDOM, KG } = dto;
        const adminResponse = await this.getAdminData(user_id);
        if (!adminResponse.success || !adminResponse.data) {
            return {
                success: false,
                message: 'Data admin tidak ditemukan',
                error: adminResponse.error,
            };
        }
        const { first_name, last_name } = adminResponse.data;
        const namaAdmin = `${first_name} ${last_name}`;
        const { data: updatedMicrothermor, error: microthermorError } = await this.supabase
            .from('microthermor')
            .update({ latitude, longitude, FO, AO, TDOM, KG })
            .eq('id', id)
            .select()
            .single();
        if (microthermorError) {
            return {
                success: false,
                message: 'Gagal mengubah data mikrotermor',
                error: microthermorError,
            };
        }
        const updatedAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Mengubah Data Mikrotermor',
            description: `${namaAdmin} mengubah nilai latitude menjadi ${latitude}, longitude menjadi ${longitude}, FO menjadi ${FO}, AO menjadi ${AO}, TDOM menjadi ${TDOM}, dan KG menjadi ${KG}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: updatedAt,
        });
        return {
            success: true,
            message: 'Berhasil memperbarui data mikrotermor',
            data: updatedMicrothermor,
        };
    }
    async deleteMicrothermor(id, user_id, ipAddress, userAgent) {
        const adminResponse = await this.getAdminData(user_id);
        if (!adminResponse.success || !adminResponse.data) {
            return {
                success: false,
                message: 'Data admin tidak ditemukan',
                error: adminResponse.error,
            };
        }
        const { first_name, last_name } = adminResponse.data;
        const namaAdmin = `${first_name} ${last_name}`;
        const { data: microthermorData, error: getMicrothermorError } = await this.supabase
            .from('microthermor')
            .select('*')
            .eq('id', id)
            .single();
        if (getMicrothermorError || !microthermorData) {
            return {
                success: false,
                message: 'Data mikrotermor tidak ditemukan',
                error: getMicrothermorError,
            };
        }
        const { latitude, longitude, FO, AO, TDOM, KG } = microthermorData;
        const { error: microthermorError } = await this.supabase
            .from('microthermor')
            .delete()
            .eq('id', id);
        if (microthermorError) {
            return {
                success: false,
                message: 'Gagal menghapus data mikrotermor',
                error: microthermorError,
            };
        }
        const deletedAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menghapus Data Mikrotermor',
            description: `${namaAdmin} menghapus data mikrotermor dengan latitude ${latitude}, longitude ${longitude}, FO ${FO}, AO ${AO}, TDOM ${TDOM}, dan KG ${KG}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: deletedAt,
        });
        return {
            success: true,
            message: 'Berhasil menghapus data mikrotermor',
            data: microthermorData,
        };
    }
    async getAllMicrothermor() {
        const { data, error } = await this.supabase
            .from('microthermor')
            .select(`*`);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data mikrotermor',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil semua data mikrotermor',
            data: data,
        };
    }
    async getMicrothermorById(id) {
        const { data, error } = await this.supabase
            .from('microthermor')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data mikrotermor berdasarkan id',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data mikrotermor berdasarkan id',
            data,
        };
    }
    async getMicrothermorByMaxMinTDOM(dto) {
        const { min_tdom, max_tdom } = dto;
        const { data, error } = await this.supabase
            .from('microthermor')
            .select('*')
            .gte('TDOM', min_tdom)
            .lte('TDOM', max_tdom);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data mikrotermor berdasarkan min max tdom',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data mikrotermor berdasarkan min max tdom',
            data,
        };
    }
};
exports.MicrothermorService = MicrothermorService;
exports.MicrothermorService = MicrothermorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], MicrothermorService);
//# sourceMappingURL=microthermor.service.js.map