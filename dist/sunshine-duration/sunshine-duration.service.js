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
exports.SunshineDurationService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let SunshineDurationService = class SunshineDurationService {
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
            'durasi matahari terbit': row[1],
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
    async saveSunshineDuration(dto, ipAddress, userAgent) {
        const { user_id, date, sunshine_duration } = dto;
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
        const { data: insertedSunshineDurationDays, error: sunshineDurationError } = await this.supabase
            .from('sunshine_duration')
            .insert({ date, sunshine_duration })
            .select();
        if (sunshineDurationError) {
            return {
                success: false,
                message: 'Gagal menyimpan data durasi matahari terbit',
                error: sunshineDurationError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Durasi Matahari Terbit',
            description: `${namaAdmin} menambahkan data durasi matahari terbit dengan nilai ${sunshine_duration} untuk tanggal ${date}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data durasi matahari terbit',
            data: insertedSunshineDurationDays,
        };
    }
    async saveExcelSunshineDuration(dto, ipAddress, userAgent) {
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
                row['durasi matahari terbit']?.toString().toLowerCase() ===
                    'durasi matahari terbit') {
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
            const sunShineDuration = row['durasi matahari terbit'];
            if (!sunShineDuration) {
                console.error('Data tidak valid untuk data:', row);
                return null;
            }
            return {
                sunshine_duration: sunShineDuration,
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
        const { data: insertedSunshineDuration, error: sunShineDurationError } = await this.supabase
            .from('sunshine_duration')
            .insert(dataWithFormattedDate)
            .select();
        if (sunShineDurationError ||
            !insertedSunshineDuration ||
            insertedSunshineDuration.length === 0) {
            return {
                success: false,
                message: 'Gagal menyimpan data durasi matahari terbit',
                error: sunShineDurationError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Durasi Matahari Terbit',
            description: `${namaAdmin} menambahkan data durasi matahari terbit dengan mengunggah file excel.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data durasi matahari terbit',
            data: insertedSunshineDuration,
        };
    }
    async updateSunshineDuration(dto, ipAddress, userAgent) {
        const { id, user_id, date, sunshine_duration } = dto;
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
        const { data: updatedSunshineDurationDays, error: sunshineDurationError } = await this.supabase
            .from('sunshine_duration')
            .update({ sunshine_duration, date })
            .eq('id', id)
            .select();
        if (sunshineDurationError) {
            return {
                success: false,
                message: 'Gagal mengubah data durasi matahari terbit',
                error: sunshineDurationError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Mengubah Data Durasi Matahari Terbit',
            description: `${namaAdmin} mengubah data durasi matahari terbit dengan nilai ${sunshine_duration} untuk tanggal ${date}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil mengubah data durasi matahari terbit',
            data: updatedSunshineDurationDays,
        };
    }
    async deleteSunshineDuration(id, user_id, ipAddress, userAgent) {
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
        const { data: sunshineDurationData, error: getSunshineDurationError } = await this.supabase
            .from('sunshine_duration')
            .select('*')
            .eq('id', id)
            .single();
        if (getSunshineDurationError || !sunshineDurationData) {
            return {
                success: false,
                message: 'Data durasi matahari terbit tidak ditemukan',
                error: getSunshineDurationError,
            };
        }
        const { date, sunshine_duration } = sunshineDurationData;
        const { error: sunshineDurationError } = await this.supabase
            .from('sunshine_duration')
            .delete()
            .eq('id', id);
        if (sunshineDurationError) {
            return {
                success: false,
                message: 'Gagal menghapus data durasi matahari terbit',
                error: sunshineDurationError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menghapus Data Durasi Matahari Terbit',
            description: `${namaAdmin} menghapus data durasi matahari terbit dengan nilai ${sunshine_duration} untuk tanggal ${date}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menghapus data durasi matahari terbit',
            data: sunshineDurationData,
        };
    }
    async getAllSunshineDuration() {
        const { data, error } = await this.supabase
            .from('sunshine_duration')
            .select('*');
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data durasi matahari terbit',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil semua data durasi matahari terbit',
            data: data,
        };
    }
    async getSunshineDurationById(id) {
        const { data, error } = await this.supabase
            .from('sunshine_duration')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data durasi matahari terbit berdasarkan id',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data durasi matahari terbit berdasarkan id',
            data,
        };
    }
    async getSunshineDurationByDate(dto) {
        const { start_date, end_date } = dto;
        const { data, error } = await this.supabase
            .from('sunshine_duration')
            .select('*')
            .gte('date', start_date)
            .lte('date', end_date);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data durasi matahari terbit berdasarkan rentang tanggal',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data durasi matahari terbit berdasarkan rentang tanggal',
            data,
        };
    }
};
exports.SunshineDurationService = SunshineDurationService;
exports.SunshineDurationService = SunshineDurationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], SunshineDurationService);
//# sourceMappingURL=sunshine-duration.service.js.map