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
exports.RainGaugeService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let RainGaugeService = class RainGaugeService {
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
    async saveRainGauge(dto, dtoQuery, ipAddress, userAgent) {
        const { date, name, file_base64 } = dto;
        const { user_id, city, village } = dtoQuery;
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
        if (!file_base64 || typeof file_base64 !== 'string') {
            return {
                success: false,
                message: 'Data file_base64 tidak ditemukan atau tidak valid',
                error: 'Missing or invalid file_base64',
            };
        }
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
        const bucketName = 'rain-gauge';
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
        const { data: rainGaugeInserted, error: insertError } = await this.supabase
            .from('rain_gauge')
            .insert({
            name,
            date,
            city,
            village,
            file_url: publicUrlData.publicUrl,
        })
            .select()
            .single();
        if (insertError) {
            return {
                success: false,
                message: 'Gagal menyimpan data pos hujan',
                error: insertError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Pos Hujan',
            description: `${namaAdmin} menambahkan pos hujan dengan nama ${name} untuk tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data pos hujan dan mengunggah gambar',
            data: rainGaugeInserted,
        };
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
            const tanggal = row.getCell(2).value?.toString() ?? null;
            const nama = row.getCell(1).value?.toString() ?? null;
            data.push({
                tanggal,
                nama,
            });
        });
        return data;
    }
    async saveExcelRainGauge(dto, dtoQuery, ipAddress, userAgent) {
        const { file_base64 } = dto;
        const { user_id, city, village } = dtoQuery;
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
            if (row.tanggal?.toLowerCase() === 'tanggal')
                return null;
            if (!row.tanggal) {
                console.error('Tanggal tidak ditemukan untuk data:', row);
                return null;
            }
            const formattedDate = this.formatDateToPostgres(row.tanggal);
            if (!formattedDate) {
                console.error('Tanggal tidak valid:', row.tanggal);
                return null;
            }
            return {
                date: formattedDate,
                name: row.nama ?? null,
                city,
                village,
                file_url: '',
            };
        })
            .filter((row) => row !== null);
        if (dataWithFormattedDate.length === 0) {
            return {
                success: false,
                message: 'Tidak ada data valid untuk disimpan',
            };
        }
        const { data: insertedRainGauge, error: rainGaugeError } = await this.supabase
            .from('rain_gauge')
            .insert(dataWithFormattedDate)
            .select();
        if (rainGaugeError ||
            !insertedRainGauge ||
            insertedRainGauge.length === 0) {
            return {
                success: false,
                message: 'Gagal menyimpan data pos hujan',
                error: rainGaugeError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Pos Hujan',
            description: `${namaAdmin} menambahkan data pos hujan dengan mengunggah file excel.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data pos hujan',
            data: insertedRainGauge,
        };
    }
    async findAll(filter) {
        let query = this.supabase.from('rain_gauge').select('*');
        if (filter.city) {
            query = query.eq('city', filter.city);
        }
        if (filter.village) {
            query = query.eq('village', filter.village);
        }
        const { data, error } = await query;
        if (error)
            throw new Error(error.message);
        return data;
    }
    async updateRainGauge(dto, dtoQuery, ipAddress, userAgent) {
        const { id, user_id } = dtoQuery;
        const { name, date, file_base64 } = dto;
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
        const { data: rainGaugeData, error: rainGaugeError } = await this.supabase
            .from('rain_gauge')
            .select('*')
            .eq('id', id)
            .single();
        if (rainGaugeError || !rainGaugeData) {
            return {
                success: false,
                message: 'Data pos hujan tidak ditemukan',
                error: rainGaugeError,
            };
        }
        const bucketName = 'rain-gauge';
        let newFileUrl = rainGaugeData.file_url;
        if (file_base64 && typeof file_base64 === 'string') {
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
            if (rainGaugeData.file_url) {
                const parts = rainGaugeData.file_url.split('/');
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
            .from('rain_gauge')
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
                message: 'Gagal mengubah data pos hujan',
                error: updateError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Mengubah Data Pos Hujan',
            description: `${namaAdmin} mengubah data pos hujan dengan nama ${name} untuk tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil mengubah data pos hujan dan mengupdate file pada storage',
            data: updatedRecord,
        };
    }
    async deleteRainGauge(id, user_id, ipAddress, userAgent) {
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
        const { data: rainGaugeData, error: getDataError } = await this.supabase
            .from('rain_gauge')
            .select('*')
            .eq('id', id)
            .single();
        if (getDataError || !rainGaugeData) {
            return {
                success: false,
                message: 'Data pos hujan tidak ditemukan',
                error: getDataError,
            };
        }
        const { name, date } = rainGaugeData;
        const bucketName = 'rain-gauge';
        if (rainGaugeData.file_url) {
            const parts = rainGaugeData.file_url.split('/');
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
            .from('rain_gauge')
            .delete()
            .eq('id', id)
            .select()
            .single();
        if (deleteError) {
            return {
                success: false,
                message: 'Gagal menghapus data pos hujan dari database',
                error: deleteError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menghapus Data Pos Hujan',
            description: `${namaAdmin} menghapus data pos hujan dengan nama ${name} untuk tanggal ${date}.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menghapus data pos hujan dan file terkait',
            data: deletedData,
        };
    }
    async getRainGaugeById(dto) {
        const { id, city, village } = dto;
        let query = this.supabase.from('rain_gauge').select('*');
        if (id !== undefined) {
            query = query.eq('id', id);
        }
        if (city) {
            query = query.eq('city', city);
        }
        if (village) {
            query = query.eq('village', village);
        }
        const { data, error } = id && !city && !village ? await query.single() : await query;
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data pos hujan berdasarkan filter yang diberikan',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data pos hujan berdasarkan filter yang diberikan',
            data,
        };
    }
    async getRainGaugeByDate(dto) {
        const { start_date, end_date, city, village } = dto;
        let query = this.supabase.from('rain_gauge').select('*');
        if (start_date) {
            query = query.gte('date', start_date);
        }
        if (end_date) {
            query = query.lte('date', end_date);
        }
        if (city) {
            query = query.eq('city', city);
        }
        if (village) {
            query = query.eq('village', village);
        }
        const { data, error } = await query;
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data pos hujan berdasarkan filter yang diberikan',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data pos hujan berdasarkan filter yang diberikan',
            data,
        };
    }
    async getRainGaugeByCityVillage(dto) {
        let query = this.supabase.from('rain_gauge').select('*');
        if (dto.city) {
            query = query.eq('city', dto.city);
        }
        if (dto.village) {
            query = query.eq('village', dto.village);
        }
        const { data, error } = await query;
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data pos hujan berdasarkan kota/desa',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data pos hujan berdasarkan kota/desa',
            data,
        };
    }
};
exports.RainGaugeService = RainGaugeService;
exports.RainGaugeService = RainGaugeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], RainGaugeService);
//# sourceMappingURL=rain-gauge.service.js.map