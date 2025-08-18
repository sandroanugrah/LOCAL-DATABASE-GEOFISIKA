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
exports.RainIntensityService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let RainIntensityService = class RainIntensityService {
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
            nama: row[1],
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
    async saveRainIntensity(dto, ipAddress, userAgent) {
        const { user_id, date, name, file_base64 } = dto;
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
        let fixedBase64 = file_base64;
        if (fixedBase64.startsWith('data:@file/jpeg;base64,')) {
            fixedBase64 = fixedBase64.replace('data:@file/jpeg;base64,', 'data:image/jpeg;base64,');
        }
        else if (!fixedBase64.startsWith('data:image/jpeg;base64,')) {
            return {
                success: false,
                message: 'Format base64 tidak dikenali atau tidak valid',
                error: 'Invalid base64 prefix',
            };
        }
        const base64Data = fixedBase64.replace(/^data:image\/\w+;base64,/, '');
        const fileBuffer = buffer_1.Buffer.from(base64Data, 'base64');
        const fileName = `${(0, uuid_1.v4)()}.jpg`;
        const bucketName = 'rain-intensity';
        const { error: uploadError } = await this.supabase.storage
            .from(bucketName)
            .upload(fileName, fileBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
        });
        if (uploadError) {
            return {
                success: false,
                message: 'Gagal mengunggah file ke Storage Supabase',
                error: uploadError,
            };
        }
        const { data: publicUrlData } = this.supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
        const { data: insertedRainIntensity, error: rainIntensityError } = await this.supabase
            .from('rain_intensity')
            .insert({
            date,
            name,
            file_url: publicUrlData.publicUrl,
        })
            .select();
        if (rainIntensityError || !insertedRainIntensity) {
            return {
                success: false,
                message: 'Gagal menyimpan data intensitas hujan',
                error: rainIntensityError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Intensitas Hujan',
            description: `${namaAdmin} menambahkan data intensitas hujan dengan nama ${name} untuk tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data intensitas hujan',
            data: insertedRainIntensity,
        };
    }
    async saveExcelRainIntensity(dto, ipAddress, userAgent) {
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
                row['nama']?.toString().toLowerCase() === 'nama') {
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
            const rainIntensity = row['nama'];
            if (!rainIntensity) {
                console.error('Nama tidak valid untuk data:', row);
                return null;
            }
            return {
                name: rainIntensity,
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
        const { data: insertedRainIntensity, error: rainIntensityError } = await this.supabase
            .from('rain_intensity')
            .insert(dataWithFormattedDate)
            .select();
        if (rainIntensityError ||
            !insertedRainIntensity ||
            insertedRainIntensity.length === 0) {
            return {
                success: false,
                message: 'Gagal menyimpan data intensitas hujan',
                error: rainIntensityError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Intensitas Hujan',
            description: `${namaAdmin} menambahkan data intensitas hujan dengan mengunggah file excel.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data intensitas hujan',
            data: insertedRainIntensity,
        };
    }
    async updateRainIntensity(dto, ipAddress, userAgent) {
        const { id, user_id, date, name, file_base64 } = dto;
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
        const { data: rainIntensityData, error: rainIntensityFetchError } = await this.supabase
            .from('rain_intensity')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (rainIntensityFetchError || !rainIntensityData) {
            return {
                success: false,
                message: 'Data intensitas hujan tidak ditemukan',
                error: rainIntensityFetchError,
            };
        }
        const bucketName = 'rain-intensity';
        let newFileUrl = rainIntensityData.file_url;
        if (file_base64) {
            if (rainIntensityData.file_url) {
                const parts = rainIntensityData.file_url.split('/');
                const oldFileName = parts[parts.length - 1];
                await this.supabase.storage.from(bucketName).remove([oldFileName]);
            }
            let fixedBase64 = file_base64;
            if (fixedBase64.startsWith('data:@file/jpeg;base64,')) {
                fixedBase64 = fixedBase64.replace('data:@file/jpeg;base64,', 'data:image/jpeg;base64,');
            }
            const newFileName = `${(0, uuid_1.v4)()}.jpg`;
            const base64Data = fixedBase64.replace(/^data:image\/\w+;base64,/, '');
            const fileBuffer = buffer_1.Buffer.from(base64Data, 'base64');
            const { error: uploadError } = await this.supabase.storage
                .from(bucketName)
                .upload(newFileName, fileBuffer, {
                contentType: 'image/jpeg',
                upsert: false,
            });
            if (uploadError) {
                return {
                    success: false,
                    message: 'Gagal mengunggah file ke Storage Supabase',
                    error: uploadError,
                };
            }
            const { data: publicUrlData } = this.supabase.storage
                .from(bucketName)
                .getPublicUrl(newFileName);
            newFileUrl = publicUrlData.publicUrl;
        }
        const { data: updatedRainIntensity, error: rainIntensityError } = await this.supabase
            .from('rain_intensity')
            .update({ name, date, file_url: newFileUrl })
            .eq('id', id)
            .select();
        if (rainIntensityError || !updatedRainIntensity) {
            return {
                success: false,
                message: 'Gagal mengubah data intensitas hujan',
                error: rainIntensityError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Mengubah Data Intensitas Hujan',
            description: `${namaAdmin} mengubah data intensitas hujan dengan nama ${name} untuk tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil mengubah data intensitas hujan',
            data: updatedRainIntensity,
        };
    }
    async deleteRainIntensity(id, user_id, ipAddress, userAgent) {
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
        const { data: rainIntensityData, error: rainIntensityError } = await this.supabase
            .from('rain_intensity')
            .select(`*`)
            .eq('id', id)
            .single();
        if (rainIntensityError || !rainIntensityData) {
            return {
                success: false,
                message: 'Data intensitas hujan tidak ditemukan',
                error: rainIntensityError,
            };
        }
        const { name, date } = rainIntensityData;
        const bucketName = 'rain-intensity';
        if (rainIntensityData.file_url) {
            const parts = rainIntensityData.file_url.split('/');
            const fileName = parts[parts.length - 1];
            const { error: deleteFileError } = await this.supabase.storage
                .from(bucketName)
                .remove([fileName]);
            if (deleteFileError) {
                return {
                    success: false,
                    message: 'Gagal menghapus file dari Storage Supabase',
                    error: deleteFileError,
                };
            }
        }
        const { error: deleteRainIntensityError } = await this.supabase
            .from('rain_intensity')
            .delete()
            .eq('id', id);
        if (deleteRainIntensityError) {
            return {
                success: false,
                message: 'Gagal menghapus data intensitas hujan',
                error: deleteRainIntensityError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menghapus Data Intensitas Hujan',
            description: `${namaAdmin} menghapus data intensitas hujan dengan nama ${name} untuk tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menghapus data intensitas hujan',
            data: rainIntensityData,
        };
    }
    async getAllRainIntensity() {
        const { data, error } = await this.supabase
            .from('rain_intensity')
            .select('*');
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data intensitas hujan',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil semua data intensitas hujan',
            data: data,
        };
    }
    async getRainIntensityById(id) {
        const { data, error } = await this.supabase
            .from('rain_intensity')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data intensitas hujan berdasarkan id',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data intensitas hujan berdasarkan id',
            data,
        };
    }
    async getRainIntensityByDate(dto) {
        const { start_date, end_date } = dto;
        const { data, error } = await this.supabase
            .from('rain_intensity')
            .select('*')
            .gte('date', start_date)
            .lte('date', end_date);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data intensitas hujan berdasarkan rentang tanggal',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data intensitas hujan berdasarkan rentang tanggal',
            data,
        };
    }
};
exports.RainIntensityService = RainIntensityService;
exports.RainIntensityService = RainIntensityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], RainIntensityService);
//# sourceMappingURL=rain-intensity.service.js.map