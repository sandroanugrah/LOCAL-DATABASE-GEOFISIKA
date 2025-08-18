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
exports.HumidityService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let HumidityService = class HumidityService {
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
    async saveHumidity(dto, ipAddress, userAgent) {
        const { user_id, humidity_07, humidity_13, humidity_18, date } = dto;
        const avg_humidity = parseFloat(((humidity_07 + humidity_13 + humidity_18) / 3).toFixed(2));
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
        const { data: insertedHumidity, error: humidityError } = await this.supabase
            .from('humidity')
            .insert({
            avg_humidity,
            humidity_07,
            humidity_13,
            humidity_18,
            date,
        })
            .select()
            .single();
        if (humidityError || !insertedHumidity) {
            return {
                success: false,
                message: 'Gagal menyimpan data kelembapan',
                error: humidityError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Kelembapan',
            description: `${namaAdmin} menambahkan data kelembapan dengan rata-rata ${avg_humidity}%. Rincian kelembapan tercatat pada pukul 07:00 sebesar ${humidity_07}%, pukul 13:00 sebesar ${humidity_13}%, dan pukul 18:00 sebesar ${humidity_18}%.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data kelembapan',
            data: insertedHumidity,
        };
    }
    async saveExcelHumidity(dto, ipAddress, userAgent) {
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
            const avg_humidity = parseFloat(((time07 + time13 + time18) / 3).toFixed(2));
            return {
                avg_humidity,
                humidity_07: time07,
                humidity_13: time13,
                humidity_18: time18,
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
        const { data: insertedHumidity, error: humidityError } = await this.supabase
            .from('humidity')
            .insert(dataWithFormattedDate)
            .select();
        if (humidityError || !insertedHumidity || insertedHumidity.length === 0) {
            return {
                success: false,
                message: 'Gagal menyimpan data kelembapan',
                error: humidityError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Kelembapan',
            description: `${namaAdmin} menambahkan data kelembapan dengan mengunggah file excel.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data kelembapan',
            data: insertedHumidity,
        };
    }
    async updateHumidity(dto, ipAddress, userAgent) {
        const { id, user_id, humidity_07, humidity_13, humidity_18, date } = dto;
        const avg_humidity = parseFloat(((humidity_07 + humidity_13 + humidity_18) / 3).toFixed(2));
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
        const { data: updatedHumidity, error: humidityError } = await this.supabase
            .from('humidity')
            .update({
            avg_humidity,
            humidity_07,
            humidity_13,
            humidity_18,
            date,
        })
            .eq('id', id)
            .select()
            .single();
        if (humidityError || !updatedHumidity) {
            return {
                success: false,
                message: 'Gagal memperbarui data kelembapan',
                error: humidityError,
            };
        }
        const updatedAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Mengubah Data Kelembapan',
            description: `${namaAdmin} mengubah data kelembapan dengan rata-rata ${avg_humidity}%. Rincian kelembapan tercatat pada pukul 07:00 sebesar ${humidity_07}%, pukul 13:00 sebesar ${humidity_13}%, dan pukul 18:00 sebesar ${humidity_18}%.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: updatedAt,
        });
        return {
            success: true,
            message: 'Berhasil memperbarui data kelembapan',
            data: updatedHumidity,
        };
    }
    async deleteHumidity(id, user_id, ipAddress, userAgent) {
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
        const { data: humidityData, error: getHumidityError } = await this.supabase
            .from('humidity')
            .select('*')
            .eq('id', id)
            .single();
        if (getHumidityError || !humidityData) {
            return {
                success: false,
                message: 'Gagal mengambil data kelembapan',
                error: getHumidityError,
            };
        }
        const { avg_humidity, humidity_07, humidity_13, humidity_18 } = humidityData;
        const { error: deleteHumidityError } = await this.supabase
            .from('humidity')
            .delete()
            .eq('id', id);
        if (deleteHumidityError) {
            return {
                success: false,
                message: 'Gagal menghapus data kelembapan',
                error: deleteHumidityError,
            };
        }
        const deletedAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menghapus Data Kelembapan',
            description: `${namaAdmin} menghapus data kelembapan dengan rata-rata ${avg_humidity}%. Rincian kelembapan tercatat pada pukul 07:00 sebesar ${humidity_07}%, pukul 13:00 sebesar ${humidity_13}%, dan pukul 18:00 sebesar ${humidity_18}%.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: deletedAt,
        });
        return {
            success: true,
            message: 'Berhasil menghapus data kelembapan',
            data: humidityData,
        };
    }
    async getAllHumidity() {
        const { data, error } = await this.supabase.from('humidity').select(`*`);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data kelembapan',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil semua data kelembapan',
            data: data,
        };
    }
    async getHumidityById(id) {
        const { data, error } = await this.supabase
            .from('humidity')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data kelembapan berdasarkan id',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data kelembapan berdasarkan id',
            data,
        };
    }
    async getHumidityByDate(dto) {
        const { start_date, end_date } = dto;
        const { data, error } = await this.supabase
            .from('humidity')
            .select('*')
            .gte('date', start_date)
            .lte('date', end_date);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data kelembapan berdasarkan rentang tanggal kelembapan',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data kelembapan berdasarkan rentang tanngal kelembapan',
            data,
        };
    }
};
exports.HumidityService = HumidityService;
exports.HumidityService = HumidityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], HumidityService);
//# sourceMappingURL=humidity.service.js.map