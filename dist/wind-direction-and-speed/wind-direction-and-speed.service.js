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
exports.WindDirectionAndSpeedService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let WindDirectionAndSpeedService = class WindDirectionAndSpeedService {
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
    async saveWindDirectionAndSpeed(dto, ipAddress, userAgent) {
        const { user_id, date, speed, most_frequent_direction, max_speed, direction, } = dto;
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
        const { data: insertedWind, error: windError } = await this.supabase
            .from('wind_direction_and_speed')
            .insert({
            date,
            speed,
            most_frequent_direction,
            max_speed,
            direction,
        })
            .select()
            .single();
        if (windError || !insertedWind) {
            return {
                success: false,
                message: 'Gagal menyimpan data arah dan kecepatan angin',
                error: windError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Arah dan Kecepatan Angin',
            description: `${namaAdmin} menambahkan data arah angin ${direction} dengan kecepatan rata-rata ${speed} dan kecepatan maksimum ${max_speed} pada tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data arah dan kecepatan angin',
            data: insertedWind,
        };
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
        const data = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1)
                return;
            const kecepatan = row.getCell(1).value;
            const kecepatan_terbesar = row.getCell(2).value;
            const arah = row.getCell(3).value?.toString();
            const arah_terbanyak = row.getCell(4).value?.toString();
            const tanggal = row.getCell(5).value;
            data.push({
                tanggal: tanggal?.toString() ?? null,
                kecepatan: typeof kecepatan === 'number'
                    ? kecepatan
                    : parseFloat(kecepatan) || null,
                'kecepatan terbesar': typeof kecepatan_terbesar === 'number'
                    ? kecepatan_terbesar
                    : parseFloat(kecepatan_terbesar) || null,
                arah: arah ?? null,
                'arah terbanyak': arah_terbanyak ?? null,
            });
        });
        return data;
    }
    async saveExcelWindDirectionAndSpeed(dto, ipAddress, userAgent) {
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
            if (row['tanggal']?.toString().toLowerCase() === 'tanggal') {
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
            return {
                date: formattedDate,
                speed: row['kecepatan'] ?? null,
                max_speed: row['kecepatan terbesar'] ?? null,
                direction: row['arah'] ?? null,
                most_frequent_direction: row['arah terbanyak'] ?? null,
            };
        })
            .filter((row) => row !== null);
        if (dataWithFormattedDate.length === 0) {
            return {
                success: false,
                message: 'Tidak ada data valid untuk disimpan',
            };
        }
        const { data: insertedwindDirectionAndSpeed, error: windDirectionAndSpeedError, } = await this.supabase
            .from('wind_direction_and_speed')
            .insert(dataWithFormattedDate)
            .select();
        if (windDirectionAndSpeedError ||
            !insertedwindDirectionAndSpeed ||
            insertedwindDirectionAndSpeed.length === 0) {
            return {
                success: false,
                message: 'Gagal menyimpan data arah dan kecepatan angin',
                error: windDirectionAndSpeedError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Arah dan Kecepatan Angin',
            description: `${namaAdmin} menambahkan data arah dan kecepatan angin dengan mengunggah file excel.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data arah dan kecepatan angin',
            data: insertedwindDirectionAndSpeed,
        };
    }
    async updateWindDirectionAndSpeed(dto, ipAddress, userAgent) {
        const { id, user_id, date, speed, most_frequent_direction, max_speed, direction, } = dto;
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
        const { data: updateWindDirectionAndSpeed, error: windDirectionAndSpeedError, } = await this.supabase
            .from('wind_direction_and_speed')
            .update({
            date,
            speed,
            most_frequent_direction,
            max_speed,
            direction,
        })
            .eq('id', id)
            .select()
            .single();
        if (windDirectionAndSpeedError || !updateWindDirectionAndSpeed) {
            return {
                success: false,
                message: 'Gagal memperbarui data arah dan kecepatan angin',
                error: windDirectionAndSpeedError,
            };
        }
        const updatedAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Mengubah Data Arah dan Kecepatan Angin',
            description: `${namaAdmin} mengubah data arah angin ${direction} dengan kecepatan rata-rata ${speed} dan kecepatan maksimum ${max_speed} pada tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: updatedAt,
        });
        return {
            success: true,
            message: 'Berhasil memperbarui data arah dan kecepatan angin',
            data: updateWindDirectionAndSpeed,
        };
    }
    async deleteWindDirectionAndSpeed(id, user_id, ipAddress, userAgent) {
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
        const { data: windDirectionAndSpeedData, error: getWindDirectionAndSpeedError, } = await this.supabase
            .from('wind_direction_and_speed')
            .select('*')
            .eq('id', id)
            .single();
        if (getWindDirectionAndSpeedError || !windDirectionAndSpeedData) {
            return {
                success: false,
                message: 'Gagal mengambil data arah dan kecepatan angin',
                error: getWindDirectionAndSpeedError,
            };
        }
        const { date, speed, max_speed, direction } = windDirectionAndSpeedData;
        const { error: deleteWindDirectionAndSpeedError } = await this.supabase
            .from('wind_direction_and_speed')
            .delete()
            .eq('id', id);
        if (deleteWindDirectionAndSpeedError) {
            return {
                success: false,
                message: 'Gagal menghapus data arah dan kecepatan angin',
                error: deleteWindDirectionAndSpeedError,
            };
        }
        const deletedAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menghapus Data Arah dan Kecepatan Angin',
            description: `${namaAdmin} menghapus data arah angin ${direction} dengan kecepatan rata-rata ${speed} dan kecepatan maksimum ${max_speed} pada tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: deletedAt,
        });
        return {
            success: true,
            message: 'Berhasil menghapus data arah dan kecepatan angin',
            data: windDirectionAndSpeedData,
        };
    }
    async getAllWindDirectionAndSpeed() {
        const { data, error } = await this.supabase
            .from('wind_direction_and_speed')
            .select(`*`);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data arah dan kecepatan angin',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil semua data arah dan kecepatan angin',
            data: data,
        };
    }
    async getWindDirectionAndSpeedById(id) {
        const { data, error } = await this.supabase
            .from('wind_direction_and_speed')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data arah dan kecepatan angin berdasarkan id',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data arah dan kecepatan angin berdasarkan id',
            data,
        };
    }
    async getWindDirectionAndSpeedByDate(dto) {
        const { start_date, end_date } = dto;
        const { data, error } = await this.supabase
            .from('wind_direction_and_speed')
            .select('*')
            .gte('date', start_date)
            .lte('date', end_date);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data arah dan kecepatan angin berdasarkan rentang tanggal arah dan kecepatan angin',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data arah dan kecepatan angin berdasarkan rentang tanngal arah dan kecepatan angin',
            data,
        };
    }
};
exports.WindDirectionAndSpeedService = WindDirectionAndSpeedService;
exports.WindDirectionAndSpeedService = WindDirectionAndSpeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], WindDirectionAndSpeedService);
//# sourceMappingURL=wind-direction-and-speed.service.js.map