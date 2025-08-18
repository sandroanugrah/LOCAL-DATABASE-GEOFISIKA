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
exports.LightningService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let LightningService = class LightningService {
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
    async saveLightning(dto, dtoQuery, ipAddress, userAgent) {
        const { name, date, file_base64 } = dto;
        const { user_id, lightning_data } = dtoQuery;
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
        const fileName = `${(0, uuid_1.v4)()}.jpg`;
        const bucketName = 'lightning';
        let fixedBase64 = file_base64;
        if (fixedBase64.startsWith('data:@file/jpeg;base64,')) {
            fixedBase64 = fixedBase64.replace('data:@file/jpeg;base64,', 'data:image/jpeg;base64,');
        }
        const base64Data = fixedBase64.replace(/^data:image\/\w+;base64,/, '');
        const fileBuffer = buffer_1.Buffer.from(base64Data, 'base64');
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
        const { data: lightningDataInserted, error: insertError } = await this.supabase
            .from('lightning')
            .insert({
            name,
            date,
            lightning_data,
            file_url: publicUrlData.publicUrl,
        })
            .select()
            .single();
        if (insertError) {
            return {
                success: false,
                message: 'Gagal menyimpan data petir',
                error: insertError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Petir',
            description: `${namaAdmin} menambahkan data petir dengan nama ${name} untuk tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data petir dan mengunggah gambar',
            data: lightningDataInserted,
        };
    }
    async saveExcelLightning(dto, dtoQuery, ipAddress, userAgent) {
        const { file_base64 } = dto;
        const { user_id, lightning_data } = dtoQuery;
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
            const lightning = row['nama'];
            if (!lightning) {
                console.error('Nama tidak valid untuk data:', row);
                return null;
            }
            return {
                name: lightning,
                date: formattedDate,
                lightning_data,
            };
        })
            .filter((row) => row !== null);
        if (dataWithFormattedDate.length === 0) {
            return {
                success: false,
                message: 'Tidak ada data valid untuk disimpan',
            };
        }
        const { data: insertedLightning, error: lightningError } = await this.supabase
            .from('lightning')
            .insert(dataWithFormattedDate)
            .select();
        if (lightningError ||
            !insertedLightning ||
            insertedLightning.length === 0) {
            return {
                success: false,
                message: 'Gagal menyimpan data petir',
                error: lightningError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Petir',
            description: `${namaAdmin} menambahkan data petir dengan mengunggah file excel.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data petir',
            data: insertedLightning,
        };
    }
    async updateLightning(dto, ipAddress, userAgent) {
        const { id, user_id, name, date, file_base64 } = dto;
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
        const { data: lightningData, error: lightningError } = await this.supabase
            .from('lightning')
            .select('*')
            .eq('id', id)
            .single();
        if (lightningError || !lightningData) {
            return {
                success: false,
                message: 'Data petir tidak ditemukan',
                error: lightningError,
            };
        }
        const bucketName = 'lightning';
        let newFileUrl = lightningData.file_url;
        if (file_base64) {
            let fixedBase64 = file_base64;
            if (fixedBase64.startsWith('data:@file/jpeg;base64,')) {
                fixedBase64 = fixedBase64.replace('data:@file/jpeg;base64,', 'data:image/jpeg;base64,');
            }
            if (lightningData.file_url) {
                const parts = lightningData.file_url.split('/');
                const oldFileName = parts[parts.length - 1];
                await this.supabase.storage.from(bucketName).remove([oldFileName]);
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
        const { data: updatedRecord, error: updateError } = await this.supabase
            .from('lightning')
            .update({
            name,
            date,
            file_url: newFileUrl,
        })
            .eq('id', id)
            .select()
            .single();
        if (updateError) {
            return {
                success: false,
                message: 'Gagal mengubah data petir',
                error: updateError,
            };
        }
        return {
            success: true,
            message: 'Data petir berhasil diperbarui',
            data: updatedRecord,
        };
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Mengubah Data Petir',
            description: `${namaAdmin} mengubah data petir dengan nama ${name} untuk tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil mengubah data petir dan mengupdate file pada storage',
            data: updatedRecord,
        };
    }
    async deleteLightning(id, user_id, ipAddress, userAgent) {
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
        const { data: lightningData, error: getDataError } = await this.supabase
            .from('lightning')
            .select('*')
            .eq('id', id)
            .single();
        if (getDataError || !lightningData) {
            return {
                success: false,
                message: 'Data petir tidak ditemukan',
                error: getDataError,
            };
        }
        const { name, date } = lightningData;
        const bucketName = 'lightning';
        if (lightningData.file_url) {
            const parts = lightningData.file_url.split('/');
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
        const { data: deletedData, error: deleteError } = await this.supabase
            .from('lightning')
            .delete()
            .eq('id', id)
            .select()
            .single();
        if (deleteError) {
            return {
                success: false,
                message: 'Gagal menghapus data petir dari database',
                error: deleteError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menghapus Data Petir',
            description: `${namaAdmin} menghapus data petir dengan nama ${name} untuk tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menghapus data petir dan file terkait',
            data: deletedData,
        };
    }
    async getLightningById(dto) {
        const { id, lightning_data } = dto;
        const { data, error } = await this.supabase
            .from('lightning')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data petir berdasarkan id',
                error,
            };
        }
        return {
            success: true,
            message: `Berhasil mengambil data petir ${lightning_data} berdasarkan id`,
            data,
        };
    }
    async getLightningByDate(dto) {
        const { lightning_data, start_date, end_date } = dto;
        let query = this.supabase
            .from('lightning')
            .select('*')
            .eq('lightning_data', lightning_data);
        if (start_date) {
            query = query.gte('date', start_date);
        }
        if (end_date) {
            query = query.lte('date', end_date);
        }
        const { data, error } = await query;
        if (error) {
            return {
                success: false,
                message: 'Gagal mengambil data petir berdasarkan filter',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data petir berdasarkan filter',
            data,
        };
    }
    async getLightningByLightningData(dto) {
        const { lightning_data } = dto;
        const { data, error } = await this.supabase
            .from('lightning')
            .select('*')
            .eq('lightning_data', lightning_data);
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data petir berdasarkan nama data',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data petir berdasarkan nama data',
            data,
        };
    }
};
exports.LightningService = LightningService;
exports.LightningService = LightningService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], LightningService);
//# sourceMappingURL=lightning.service.js.map