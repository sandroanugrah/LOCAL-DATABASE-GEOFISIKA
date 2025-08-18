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
exports.RainfallService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let RainfallService = class RainfallService {
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
            'curah hujan': row[1],
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
    async saveRainfall(dto, ipAddress, userAgent) {
        const { user_id, date, rainfall } = dto;
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
        const { data: insertedRainfall, error: rainfallError } = await this.supabase
            .from('rainfall')
            .insert({ date, rainfall })
            .select();
        if (rainfallError || !insertedRainfall) {
            return {
                success: false,
                message: 'Gagal menyimpan data curah hujan',
                error: rainfallError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Curah Hujan',
            description: `${namaAdmin} menambahkan data curah hujan dengan nilai ${rainfall} untuk tanggal ${date}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data curah hujan',
            data: insertedRainfall,
        };
    }
    async saveExcelRainfall(dto, ipAddress, userAgent) {
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
                row['curah hujan']?.toString().toLowerCase() === 'curah hujan') {
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
            const rainfall = parseFloat(row['curah hujan']);
            if (isNaN(rainfall)) {
                console.error('Curah hujan tidak valid untuk data:', row);
                return null;
            }
            return {
                rainfall,
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
        const { data: insertedRainfall, error: rainfallError } = await this.supabase
            .from('rainfall')
            .insert(dataWithFormattedDate)
            .select();
        if (rainfallError || !insertedRainfall || insertedRainfall.length === 0) {
            return {
                success: false,
                message: 'Gagal menyimpan data curah hujan',
                error: rainfallError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Curah Hujan',
            description: `${namaAdmin} menambahkan data curah hujan dengan mengunggah file excel.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data curah hujan',
            data: insertedRainfall,
        };
    }
    async updateRainfall(dto, ipAddress, userAgent) {
        const { id, user_id, date, rainfall } = dto;
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
        const { data: updatedRainfall, error: rainfallError } = await this.supabase
            .from('rainfall')
            .update({ rainfall, date })
            .eq('id', id)
            .select();
        if (rainfallError || !updatedRainfall) {
            return {
                success: false,
                message: 'Gagal mengubah data curah hujan',
                error: rainfallError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Mengubah Data Curah Hujan',
            description: `${namaAdmin} mengubah data curah hujan dengan nilai ${rainfall} untuk tanggal ${date}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil mengubah data curah hujan',
            data: updatedRainfall,
        };
    }
    async deleteRainfall(id, user_id, ipAddress, userAgent) {
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
        const { data: rainfallData, error: getRainfallError } = await this.supabase
            .from('rainfall')
            .select('*')
            .eq('id', id)
            .single();
        if (getRainfallError || !rainfallData) {
            return {
                success: false,
                message: 'Data curah hujan tidak ditemukan',
                error: getRainfallError,
            };
        }
        const { rainfall, date } = rainfallData;
        const { error: rainfallError } = await this.supabase
            .from('rainfall')
            .delete()
            .eq('id', id)
            .select();
        if (rainfallError) {
            return {
                success: false,
                message: 'Gagal menghapus data curah hujan',
                error: rainfallError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menghapus Data Curah Hujan',
            description: `${namaAdmin} menghapus data curah hujan dengan nilai ${rainfall} untuk tanggal ${date}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menghapus data curah hujan',
            data: rainfallData,
        };
    }
    async getAllRainfall() {
        const { data, error } = await this.supabase.from('rainfall').select('*');
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data curah hujan',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil semua data curah hujan',
            data: data,
        };
    }
    async getRainfallById(id) {
        const { data, error } = await this.supabase
            .from('rainfall')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data curah hujan berdasarkan id',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data curah hujan berdasarkan id',
            data,
        };
    }
    async getRainfallByDate(dto) {
        const { start_date, end_date } = dto;
        const { data, error } = await this.supabase
            .from('rainfall')
            .select('*')
            .gte('date', start_date)
            .lte('date', end_date);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data curah hujan berdasarkan rentang tanggal',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data curah hujan berdasarkan rentang tanggal',
            data,
        };
    }
};
exports.RainfallService = RainfallService;
exports.RainfallService = RainfallService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], RainfallService);
//# sourceMappingURL=rainfall.service.js.map