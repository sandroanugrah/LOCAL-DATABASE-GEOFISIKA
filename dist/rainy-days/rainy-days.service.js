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
exports.RainyDaysService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let RainyDaysService = class RainyDaysService {
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
    async decodeBase64ToExcel(base64) {
        try {
            const buffer = buffer_1.Buffer.from(base64, 'base64');
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            return workbook;
        }
        catch (error) {
            console.error('Error decoding base64 to Excel:', error);
            return null;
        }
    }
    parseExcelToData(workbook) {
        const worksheet = workbook.worksheets[0];
        return worksheet
            .getSheetValues()
            .slice(1)
            .filter((row) => row !== null && row !== undefined)
            .map((row) => ({
            'hari hujan': row[1],
            tanggal: row[2],
        }));
    }
    formatDateToPostgres(date) {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate.toISOString().split('T')[0];
        }
        const [month, day, year] = date.split('/');
        if (month && day && year && year.length === 4) {
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        const [day2, month2] = date.split('.');
        if (day2 && month2) {
            const currentYear = new Date().getFullYear();
            return `${currentYear}-${month2.padStart(2, '0')}-${day2.padStart(2, '0')}`;
        }
        return null;
    }
    async saveRainyDays(dto, ipAddress, userAgent) {
        const { user_id, date, rainy_day } = dto;
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
        const { data: insertedRainyDays, error: rainyDaysError } = await this.supabase
            .from('rainy_days')
            .insert({ date, rainy_day })
            .select();
        if (rainyDaysError) {
            return {
                success: false,
                message: 'Gagal menyimpan data hari hujan',
                error: rainyDaysError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Hari Hujan',
            description: `${namaAdmin} menambahkan data hari hujan dengan nilai ${rainy_day} untuk tanggal ${date}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data hari hujan',
            data: insertedRainyDays,
        };
    }
    async saveExcelRainyDays(dto, ipAddress, userAgent) {
        const { user_id, file_base64 } = dto;
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
        const workbook = await this.decodeBase64ToExcel(file_base64);
        if (!workbook) {
            return {
                success: false,
                message: 'Gagal mendecode base64 menjadi file Excel',
            };
        }
        const data = this.parseExcelToData(workbook);
        if (data.length === 0) {
            return {
                success: false,
                message: 'Data Excel kosong atau tidak valid',
            };
        }
        const dataWithFormattedDate = data
            .map((row) => {
            if (row['tanggal']?.toString().toLowerCase() === 'tanggal' ||
                row['hari hujan']?.toString().toLowerCase() === 'hari hujan') {
                return null;
            }
            if (!row['tanggal']) {
                console.error('Tanggal tidak ditemukan untuk data:', row);
                return null;
            }
            const formattedDate = this.formatDateToPostgres(row['tanggal']);
            if (!formattedDate) {
                console.error('Tanggal tidak valid:', row['tanggal']);
                return null;
            }
            const rainyDays = row['hari hujan']?.toString().toLowerCase();
            return {
                rainy_day: rainyDays,
                date: formattedDate,
            };
        })
            .filter((row) => row !== null);
        if (dataWithFormattedDate.length === 0) {
            return {
                success: false,
                message: 'Tidak ada data valid untuk disimpan',
            };
        }
        const { data: insertedrainyDays, error: rainyDaysError } = await this.supabase
            .from('rainy_days')
            .insert(dataWithFormattedDate)
            .select();
        if (rainyDaysError ||
            !insertedrainyDays ||
            insertedrainyDays.length === 0) {
            return {
                success: false,
                message: 'Gagal menyimpan data hari hujan',
                error: rainyDaysError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Hari Hujan',
            description: `${namaAdmin} menambahkan data hari hujan dengan mengunggah file excel.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data hari hujan',
            data: insertedrainyDays,
        };
    }
    async updateRainyDays(dto, ipAddress, userAgent) {
        const { id, user_id, date, rainy_day } = dto;
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
        const { data: updatedRainyDays, error: rainyDaysError } = await this.supabase
            .from('rainy_days')
            .update({ rainy_day, date })
            .eq('id', id)
            .select();
        if (rainyDaysError) {
            return {
                success: false,
                message: 'Gagal mengubah data hari hujan',
                error: rainyDaysError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Mengubah Data Hari Hujan',
            description: `${namaAdmin} mengubah data hari hujan dengan nilai ${rainy_day} untuk tanggal ${date}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil memperbarui data hari hujan',
            data: updatedRainyDays,
        };
    }
    async deleteRainyDays(id, user_id, ipAddress, userAgent) {
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
        const { data: rainyDaysData, error: getRainyDaysError } = await this.supabase.from('rainy_days').select('*').eq('id', id).single();
        if (getRainyDaysError) {
            return {
                success: false,
                message: 'Gagal mengambil data hari hujan',
                error: getRainyDaysError,
            };
        }
        const { rainy_day, date } = rainyDaysData;
        const { error: rainyDaysError } = await this.supabase
            .from('rainy_days')
            .delete()
            .eq('id', id);
        if (rainyDaysError) {
            return {
                success: false,
                message: 'Gagal menghapus data hari hujan',
                error: rainyDaysError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menghapus Data Hari Hujan',
            description: `${namaAdmin} menghapus data hari hujan dengan nilai ${rainy_day} untuk tanggal ${date}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menghapus data hari hujan',
            data: rainyDaysData,
        };
    }
    async getAllRainyDays() {
        const { data, error } = await this.supabase.from('rainy_days').select('*');
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil semua data hari hujan',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil semua data hari hujan',
            data: data,
        };
    }
    async getRainyDaysById(id) {
        const { data, error } = await this.supabase
            .from('rainy_days')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data hari hujan berdasarkan id',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data hari hujan berdasarkan id',
            data,
        };
    }
    async getRainyDaysByDate(dto) {
        const { start_date, end_date } = dto;
        const { data, error } = await this.supabase
            .from('rainy_days')
            .select('*')
            .gte('date', start_date)
            .lte('date', end_date);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data hari hujan berdasarkan rentang tanggal',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data hari hujan berdasarkan rentang tanggal',
            data,
        };
    }
};
exports.RainyDaysService = RainyDaysService;
exports.RainyDaysService = RainyDaysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], RainyDaysService);
//# sourceMappingURL=rainy-days.service.js.map