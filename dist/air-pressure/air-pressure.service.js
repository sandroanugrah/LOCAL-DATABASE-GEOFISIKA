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
exports.AirPressureService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let AirPressureService = class AirPressureService {
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
    async saveAirPressure(dto, ipAddress, userAgent) {
        const { user_id, air_pressure, air_pressure_07, air_pressure_13, air_pressure_18, date, } = dto;
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
        const { data: insertedAirPressure, error: airPressureError } = await this.supabase
            .from('air_pressure')
            .insert({
            air_pressure,
            air_pressure_07,
            air_pressure_13,
            air_pressure_18,
            date,
        })
            .select()
            .single();
        if (airPressureError || !insertedAirPressure) {
            return {
                success: false,
                message: 'Gagal menyimpan data tekanan udara',
                error: airPressureError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Tekanan Udara',
            description: `${namaAdmin} menambahkan data tekanan udara sebesar ${air_pressure}, dengan rincian: 07.00 = ${air_pressure_07}, 13.00 = ${air_pressure_13}, 18.00 = ${air_pressure_18}. Data ini telah disimpan pada tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data tekanan udara',
            data: insertedAirPressure,
        };
    }
    async saveExcelAirPressure(dto, ipAddress, userAgent) {
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
            const air_pressure = parseFloat(((time07 + time13 + time18) / 3).toFixed(2));
            return {
                air_pressure,
                air_pressure_07: time07,
                air_pressure_13: time13,
                air_pressure_18: time18,
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
        const { data: insertedAirPressure, error: airPressureError } = await this.supabase
            .from('air_pressure')
            .insert(dataWithFormattedDate)
            .select();
        if (airPressureError ||
            !insertedAirPressure ||
            insertedAirPressure.length === 0) {
            return {
                success: false,
                message: 'Gagal menyimpan data tekanan udara',
                error: airPressureError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Tekanan Udara',
            description: `${namaAdmin} menambahkan data tekanan udara dengan mengunggah file excel.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data tekanan udara',
            data: insertedAirPressure,
        };
    }
    async updateAirPressure(dto, ipAddress, userAgent) {
        const { id, user_id, air_pressure, air_pressure_07, air_pressure_13, air_pressure_18, date, } = dto;
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
        const { data: updatedAirPressure, error: airPressureError } = await this.supabase
            .from('air_pressure')
            .update({
            air_pressure,
            air_pressure_07,
            air_pressure_13,
            air_pressure_18,
            date,
        })
            .eq('id', id)
            .select()
            .single();
        if (airPressureError || !updatedAirPressure) {
            return {
                success: false,
                message: 'Gagal memperbarui data tekanan udara',
                error: airPressureError,
            };
        }
        const updatedAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Mengubah Data Tekanan Udara',
            description: `${namaAdmin} mengubah data tekanan udara sebesar ${air_pressure}, dengan rincian: 07.00 = ${air_pressure_07}, 13.00 = ${air_pressure_13}, 18.00 = ${air_pressure_18}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: updatedAt,
        });
        return {
            success: true,
            message: 'Berhasil memperbarui data tekanan udara',
            data: updatedAirPressure,
        };
    }
    async deleteAirPressure(id, user_id, ipAddress, userAgent) {
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
        const { data: airPressureData, error: getAirPressureError } = await this.supabase
            .from('air_pressure')
            .select('*')
            .eq('id', id)
            .single();
        if (getAirPressureError || !airPressureData) {
            return {
                success: false,
                message: 'Gagal mengambil data kelembapan',
                error: getAirPressureError,
            };
        }
        const { air_pressure, air_pressure_07, air_pressure_13, air_pressure_18 } = airPressureData;
        const { error: airPressureError } = await this.supabase
            .from('air_pressure')
            .delete()
            .eq('id', id)
            .select();
        if (airPressureError) {
            return {
                success: false,
                message: 'Gagal menghapus data tekanan udara',
                error: airPressureError,
            };
        }
        const deletedAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menghapus Data Tekanan Udara',
            description: `${namaAdmin} menghapus data tekanan udara sebesar ${air_pressure}, dengan rincian: 07.00 = ${air_pressure_07}, 13.00 = ${air_pressure_13}, 18.00 = ${air_pressure_18}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: deletedAt,
        });
        return {
            success: true,
            message: 'Berhasil menghapus data tekanan udara',
            data: airPressureData,
        };
    }
    async getAllAirPressure() {
        const { data, error } = await this.supabase
            .from('air_pressure')
            .select(`*`);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data tekanan udara',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil semua data tekanan udara',
            data: data,
        };
    }
    async getAirPressureById(id) {
        const { data, error } = await this.supabase
            .from('air_pressure')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data tekanan udara berdasarkan id',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data tekanan udara berdasarkan id',
            data,
        };
    }
    async getAirPressureByDate(dto) {
        const { start_date, end_date } = dto;
        const { data, error } = await this.supabase
            .from('air_pressure')
            .select('*')
            .gte('date', start_date)
            .lte('date', end_date);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data tekanan udara berdasarkan rentang tanggal tekanan udara',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data tekanan udara berdasarkan rentang tanggal tekanan udara',
            data,
        };
    }
};
exports.AirPressureService = AirPressureService;
exports.AirPressureService = AirPressureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], AirPressureService);
//# sourceMappingURL=air-pressure.service.js.map