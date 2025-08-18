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
exports.AverageTemperatureService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let AverageTemperatureService = class AverageTemperatureService {
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
            .map((row) => {
            const jam07 = Number(row[1]);
            const jam13 = Number(row[2]);
            const jam18 = Number(row[3]);
            const tanggal = row[4];
            return {
                '7:00': jam07,
                '13:00': jam13,
                '18:00': jam18,
                tanggal: tanggal,
            };
        });
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
    async saveAverageTemperature(dto, ipAddress, userAgent) {
        const { user_id, avg_temperature_07, avg_temperature_13, avg_temperature_18, date, } = dto;
        const avg_temperature = parseFloat(((avg_temperature_07 + avg_temperature_13 + avg_temperature_18) /
            3).toFixed(2));
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
        const { data: insertedAvgTemperature, error: insertError } = await this.supabase
            .from('average_temperature')
            .insert([
            {
                avg_temperature,
                avg_temperature_07,
                avg_temperature_13,
                avg_temperature_18,
                date,
            },
        ])
            .select();
        if (insertError) {
            return {
                success: false,
                message: 'Gagal menyimpan data temperatur rata rata',
                error: insertError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Temperatur Rata-Rata',
            description: `${namaAdmin} menambahkan data temperatur rata-rata sebesar ${avg_temperature}°C, yang diukur pada pukul ${avg_temperature_07}, ${avg_temperature_13}, dan ${avg_temperature_18}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data temperatur rata rata',
            data: insertedAvgTemperature,
        };
    }
    async saveExcelAverageTemperature(dto, ipAddress, userAgent) {
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
            if (row['7:00']?.toString().toLowerCase() === '7:00' ||
                row['13:00']?.toString().toLowerCase() === '13:00' ||
                row['18:00']?.toString().toLowerCase() === '18:00' ||
                row['tanggal']?.toString().toLowerCase() === 'tanggal') {
                return null;
            }
            const time07 = parseFloat(String(row['7:00']));
            if (isNaN(time07)) {
                console.error('Nilai 07:00 tidak valid:', row);
                return null;
            }
            const time13 = parseFloat(String(row['13:00']));
            if (isNaN(time13)) {
                console.error('Nilai 13:00 tidak valid:', row);
                return null;
            }
            const time18 = parseFloat(String(row['18:00']));
            if (isNaN(time18)) {
                console.error('Nilai 18:00 tidak valid:', row);
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
            const averageTemperature = parseFloat(((time07 + time13 + time18) / 3).toFixed(2));
            return {
                avg_temperature: averageTemperature,
                avg_temperature_07: time07,
                avg_temperature_13: time13,
                avg_temperature_18: time18,
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
        const { data: insertedAverageTemperaturePressure, error: averageTemperaturePressureError, } = await this.supabase
            .from('average_temperature')
            .insert(dataWithFormattedDate)
            .select();
        if (averageTemperaturePressureError ||
            !insertedAverageTemperaturePressure ||
            insertedAverageTemperaturePressure.length === 0) {
            return {
                success: false,
                message: 'Gagal menyimpan data temperatur rata rata',
                error: averageTemperaturePressureError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Temperatur Rata Rata',
            description: `${namaAdmin} menambahkan data temperatur rata rata dengan mengunggah file excel.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data temperatur rata rata',
            data: insertedAverageTemperaturePressure,
        };
    }
    async updateAverageTemperature(dto, ipAddress, userAgent) {
        const { id, user_id, avg_temperature_07, avg_temperature_13, avg_temperature_18, date, } = dto;
        const avg_temperature = parseFloat(((avg_temperature_07 + avg_temperature_13 + avg_temperature_18) /
            3).toFixed(2));
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
        const { data: updatedAvgTemperature, error: updateError } = await this.supabase
            .from('average_temperature')
            .update({
            avg_temperature,
            avg_temperature_07,
            avg_temperature_13,
            avg_temperature_18,
            date,
        })
            .eq('id', id)
            .select();
        if (updateError) {
            return {
                success: false,
                message: 'Gagal mengubah data temperatur rata rata',
                error: updateError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Mengubah Data Temperatur Rata-Rata',
            description: `${namaAdmin} mengubah data temperatur rata-rata sebesar ${avg_temperature}°C, yang diukur pada pukul ${avg_temperature_07}, ${avg_temperature_13}, dan ${avg_temperature_18}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil mengubah data temperatur rata rata',
            data: updatedAvgTemperature,
        };
    }
    async deleteAverageTemperature(id, user_id, ipAddress, userAgent) {
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
        const { data: avgTemperatureData, error: getAvgTemperatureError } = await this.supabase
            .from('average_temperature')
            .select('*')
            .eq('id', id)
            .single();
        if (getAvgTemperatureError) {
            return {
                success: false,
                message: 'Gagal mengambil data temperatur rata rata',
                error: getAvgTemperatureError,
            };
        }
        const { avg_temperature, avg_temperature_07, avg_temperature_13, avg_temperature_18, } = avgTemperatureData;
        const { error: deleteError } = await this.supabase
            .from('average_temperature')
            .delete()
            .eq('id', id);
        if (deleteError) {
            return {
                success: false,
                message: 'Gagal menghapus data temperatur rata rata',
                error: deleteError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menghapus Data Temperatur Rata-Rata',
            description: `${namaAdmin} menghapus data temperatur rata-rata sebesar ${avg_temperature}°C, yang diukur pada pukul ${avg_temperature_07}, ${avg_temperature_13}, dan ${avg_temperature_18}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menghapus data temperatur rata rata',
            data: avgTemperatureData,
        };
    }
    async getAllAverageTemperature() {
        const { data, error } = await this.supabase
            .from('average_temperature')
            .select('*');
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data temperatur rata rata',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil semua data temperatur rata rata',
            data: data,
        };
    }
    async getAverageTemperatureById(id) {
        const { data, error } = await this.supabase
            .from('average_temperature')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data temperatur rata rata berdasarkan id',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data temperatur rata rata berdasarkan id',
            data,
        };
    }
    async getAverageTemperatureByDate(dto) {
        const { start_date, end_date } = dto;
        const { data, error } = await this.supabase
            .from('average_temperature')
            .select('*')
            .gte('date', start_date)
            .lte('date', end_date);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data temperatur rata rata berdasarkan rentang tanggal temperatur rata rata',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data temperatur rata rata berdasarkan rentang tanggal temperatur rata rata',
            data,
        };
    }
};
exports.AverageTemperatureService = AverageTemperatureService;
exports.AverageTemperatureService = AverageTemperatureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], AverageTemperatureService);
//# sourceMappingURL=average-temperature.service.js.map