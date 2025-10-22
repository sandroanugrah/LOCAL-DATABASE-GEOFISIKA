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
exports.EarthquakeService = void 0;
const buffer_1 = require("buffer");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const activity_log_service_1 = require("../activity-log/activity-log.service");
dotenv.config();
let EarthquakeService = class EarthquakeService {
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
    async isDuplicateEarthquake(data) {
        try {
            const date = typeof data.date_time === 'string'
                ? new Date(data.date_time)
                : data.date_time;
            const { magnitude, depth, latitude, longitude } = data;
            const startTime = new Date(date.getTime() - 5000).toISOString();
            const endTime = new Date(date.getTime() + 5000).toISOString();
            const { data: existing, error } = await this.supabase
                .from('earthquake')
                .select('id')
                .gte('date_time', startTime)
                .lte('date_time', endTime)
                .eq('magnitude', magnitude)
                .eq('depth', depth)
                .eq('latitude', latitude)
                .eq('longitude', longitude)
                .limit(1)
                .maybeSingle();
            if (error) {
                console.error('Error checking duplicate earthquake:', error);
                return false;
            }
            return !!existing;
        }
        catch (err) {
            console.error('Unexpected error checking duplicate earthquake:', err);
            return false;
        }
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
            waktu: row[1],
            mmi: row[2],
            deskripsi: row[3],
            'kedalaman (km)': row[4],
            lintang: row[5],
            bujur: row[6],
            magnitudo: row[7],
            'nama pengamat': row[8],
            tanggal: row[9],
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
    parseEarthquakeInput(input) {
        const regexWithoutMMI = /Mag:([\d.]+),\s(\d{2}-[a-zA-Z]{3}-\d{2})\s(\d{2}:\d{2}:\d{2})\sWIB,\sLok:([\d.]+)\sLS\s-\s([\d.]+)\sBT\s\((\d+)\skm\s([^)]+)\),\sKedlmn:\s(\d+)\s?[Kk][Mm]\s::(.+)/;
        const regexWithMMI = /Mag:([\d.]+),\s(\d{2}-[a-zA-Z]{3}-\d{2})\s(\d{2}:\d{2}:\d{2})\sWIB,\sLok:([\d.]+)\sLS\s-\s([\d.]+)\sBT\s\((\d+)\skm\s([^)]+)\),\sKedlmn:\s(\d+)\s?[Kk][Mm],\sdirasakan\sDi\s(.+?)\s::(.+)/;
        let matches;
        let hasMMI = false;
        matches = input.match(regexWithMMI);
        if (matches) {
            hasMMI = true;
        }
        else {
            matches = input.match(regexWithoutMMI);
        }
        if (!matches) {
            throw new Error('Format input tidak valid');
        }
        const magnitude = parseFloat(matches[1]);
        const dateStr = matches[2];
        const timeStr = matches[3];
        const date_time = this.combineDateTime(dateStr, timeStr);
        const latitude = -Math.abs(parseFloat(matches[4].replace(',', '.')));
        const longitude = parseFloat(matches[5].replace(',', '.'));
        const depth = parseInt(matches[8], 10);
        const location = matches[7].trim();
        const mmi = hasMMI ? matches[9].trim() : null;
        const observerName = hasMMI ? matches[10].trim() : matches[9].trim();
        return {
            magnitude,
            date_time,
            latitude,
            longitude,
            depth,
            description: location,
            mmi,
            observerName,
        };
    }
    combineDateTime(dateStr, timeStr) {
        const [day, monthStr, year] = dateStr.split('-');
        const months = {
            jan: '01',
            feb: '02',
            mar: '03',
            apr: '04',
            mei: '05',
            jun: '06',
            jul: '07',
            agu: '08',
            sep: '09',
            okt: '10',
            nov: '11',
            des: '12',
        };
        const month = months[monthStr.toLowerCase()];
        if (!month)
            throw new Error('Bulan tidak valid');
        const fullYear = 2000 + parseInt(year, 10);
        const isoString = `${fullYear}-${month}-${day.padStart(2, '0')}T${timeStr}+07:00`;
        return new Date(isoString);
    }
    async saveEarthquake(dto, ipAddress, userAgent) {
        const { user_id, date_time, mmi, description, depth, latitude, longitude, magnitude, observer_name, } = dto;
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
        const isDuplicate = await this.isDuplicateEarthquake({
            date_time,
            magnitude,
            depth,
            latitude,
            longitude,
        });
        if (isDuplicate) {
            return {
                success: false,
                message: '⚠️ Gagal menambahkan data karena data duplikat.',
            };
        }
        const { data: insertedEarthquake, error: earthquakeError } = await this.supabase
            .from('earthquake')
            .insert({
            date_time,
            mmi,
            description,
            depth,
            latitude,
            longitude,
            magnitude,
            observer_name,
        })
            .select();
        if (earthquakeError || !insertedEarthquake) {
            return {
                success: false,
                message: 'Gagal menyimpan data gempa',
                error: earthquakeError ? earthquakeError.message : 'Unknown error',
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Gempa',
            description: `${namaAdmin} menambahkan data gempa dengan tingkat intensitas ${mmi}, terdeteksi pada koordinat (${latitude}, ${longitude}), dengan kedalaman ${depth} km.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data gempa',
            data: insertedEarthquake,
        };
    }
    async saveEarthquakeParse(dto, ipAddress, userAgent) {
        const { input, user_id } = dto;
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
        const { magnitude, date_time, latitude, longitude, depth, description, mmi, observerName, } = this.parseEarthquakeInput(input);
        const isDuplicate = await this.isDuplicateEarthquake({
            date_time,
            magnitude,
            depth,
            latitude,
            longitude,
        });
        if (isDuplicate) {
            return {
                success: false,
                message: '⚠️ Gagal menambahkan data karena data duplikat.',
            };
        }
        const { data: insertedEarthquake, error: earthquakeError } = await this.supabase
            .from('earthquake')
            .insert({
            date_time,
            magnitude,
            description,
            depth,
            latitude,
            longitude,
            mmi,
            observer_name: observerName,
        })
            .select();
        if (earthquakeError || !insertedEarthquake) {
            return {
                success: false,
                message: 'Gagal menyimpan data gempa',
                error: earthquakeError ? earthquakeError.message : 'Unknown error',
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Gempa',
            description: `${namaAdmin} menambahkan data gempa dengan tingkat intensitas ${magnitude}, terdeteksi pada koordinat (${latitude}, ${longitude}), dengan kedalaman ${depth} km.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menyimpan data gempa',
            data: insertedEarthquake,
        };
    }
    gabungTanggalWaktu(tanggal, waktu) {
        try {
            const tgl = new Date(tanggal);
            let jam = 0, menit = 0, detik = 0;
            if (typeof waktu === 'string') {
                const [j, m, d] = waktu.split(':').map((v) => parseInt(v, 10));
                if ([j, m, d].some((v) => isNaN(v)))
                    return null;
                jam = j;
                menit = m;
                detik = d;
            }
            else if (waktu instanceof Date) {
                jam = waktu.getUTCHours();
                menit = waktu.getUTCMinutes();
                detik = waktu.getUTCSeconds();
            }
            tgl.setHours(jam);
            tgl.setMinutes(menit);
            tgl.setSeconds(detik);
            return tgl;
        }
        catch (e) {
            return null;
        }
    }
    async saveExcelEarthquake(dto, ipAddress, userAgent) {
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
                row['waktu']?.toString().toLowerCase() === 'waktu' ||
                row['mmi']?.toString().toLowerCase() === 'mmi' ||
                row['deskripsi']?.toString().toLowerCase() === 'deskripsi' ||
                row['kedalaman (km)']?.toString().toLowerCase() ===
                    'kedalaman (km)' ||
                row['lintang']?.toString().toLowerCase() === 'lintang' ||
                row['bujur']?.toString().toLowerCase() === 'bujur' ||
                row['magnitudo']?.toString().toLowerCase() === 'magnitudo' ||
                row['nama pengamat']?.toString().toLowerCase() === 'nama pengamat') {
                return null;
            }
            if (!row['tanggal'])
                return null;
            const formattedDate = this.formatDateToPostgres(row['tanggal']);
            if (!formattedDate)
                return null;
            const time = row['waktu'];
            const dateTime = this.gabungTanggalWaktu(formattedDate, time);
            if (!dateTime)
                return null;
            const mmi = row['mmi'];
            const description = row['deskripsi'];
            const depth = Number(row['kedalaman (km)']);
            const latitude = Number(row['lintang']);
            const longitude = Number(row['bujur']);
            const magnitude = Number(row['magnitudo']);
            const observerName = row['nama pengamat'];
            if (!mmi ||
                !description ||
                isNaN(depth) ||
                isNaN(latitude) ||
                isNaN(longitude) ||
                isNaN(magnitude) ||
                !observerName) {
                return null;
            }
            return {
                date_time: dateTime,
                mmi,
                description,
                depth,
                latitude,
                longitude,
                magnitude,
                observer_name: observerName,
            };
        })
            .filter((row) => row !== null);
        if (dataWithFormattedDate.length === 0) {
            return {
                success: false,
                message: 'Tidak ada data valid untuk disimpan',
            };
        }
        const nonDuplicateData = [];
        for (const item of dataWithFormattedDate) {
            const isDuplicate = await this.isDuplicateEarthquake({
                date_time: item.date_time,
                magnitude: item.magnitude,
                depth: item.depth,
                latitude: item.latitude,
                longitude: item.longitude,
            });
            if (!isDuplicate) {
                nonDuplicateData.push(item);
            }
        }
        if (nonDuplicateData.length === 0) {
            return {
                success: false,
                message: '⚠️ Semua data di file Excel sudah ada di database. Tidak ada data baru yang disimpan.',
            };
        }
        const { data: earthquakeEvaporation, error: earthquakeError } = await this.supabase.from('earthquake').insert(nonDuplicateData).select();
        if (earthquakeError ||
            !earthquakeEvaporation ||
            earthquakeEvaporation.length === 0) {
            return {
                success: false,
                message: 'Gagal menyimpan data gempa',
                error: earthquakeError,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menambahkan Data Gempa',
            description: `${namaAdmin} menambahkan data gempa dengan mengunggah file excel.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: `Berhasil menyimpan ${nonDuplicateData.length} data gempa (duplikat diabaikan)`,
            data: earthquakeEvaporation,
        };
    }
    async updateEarthquake(dto, ipAddress, userAgent) {
        const { id, user_id, date_time, mmi, description, depth, latitude, longitude, magnitude, observer_name, } = dto;
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
        const { data: updatedEarthquake, error: earthquakeError } = await this.supabase
            .from('earthquake')
            .update({
            date_time,
            mmi,
            description,
            depth,
            latitude,
            longitude,
            magnitude,
            observer_name,
        })
            .eq('id', id)
            .select();
        if (earthquakeError || !updatedEarthquake) {
            return {
                success: false,
                message: 'Gagal mengubah data gempa',
                error: earthquakeError ? earthquakeError.message : 'Unknown error',
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Mengubah Data Gempa',
            description: `${namaAdmin} mengubah data gempa dengan tingkat intensitas ${mmi}, terdeteksi pada koordinat (${latitude}, ${longitude}), dengan kedalaman ${depth} km.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil mengubah data gempa',
            data: updatedEarthquake,
        };
    }
    async deleteEarthquake(id, user_id, ipAddress, userAgent) {
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
        const { data: earthquakeData, error: getEarthquakeError } = await this.supabase.from('earthquake').select('*').eq('id', id).single();
        if (getEarthquakeError || !earthquakeData) {
            return {
                success: false,
                message: 'Data gempa tidak ditemukan',
                error: getEarthquakeError
                    ? getEarthquakeError.message
                    : 'Unknown error',
            };
        }
        const { mmi, depth, latitude, longitude } = earthquakeData;
        const { error: deleteEarthquakeError } = await this.supabase
            .from('earthquake')
            .delete()
            .eq('id', id);
        if (deleteEarthquakeError) {
            return {
                success: false,
                message: 'Gagal menghapus data gempa',
                error: deleteEarthquakeError.message,
            };
        }
        const createdAt = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        await this.activityLogService.logActivity({
            admin_id: user_id,
            action: 'Menghapus Data Gempa',
            description: `${namaAdmin} menghapus data gempa dengan tingkat intensitas ${mmi}, terdeteksi pada koordinat (${latitude}, ${longitude}), dengan kedalaman ${depth} km.`,
            ip_address: ipAddress,
            user_agent: userAgent,
            created_at: createdAt,
        });
        return {
            success: true,
            message: 'Berhasil menghapus data gempa',
            data: earthquakeData,
        };
    }
    async getAllEarthquake() {
        const { data, error } = await this.supabase.from('earthquake').select('*');
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data gempa',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil semua data gempa',
            data: data,
        };
    }
    async getEarthquakeById(id) {
        const { data, error } = await this.supabase
            .from('earthquake')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data gempa berdasarkan id',
                error,
            };
        }
        return {
            success: true,
            message: 'Berhasil mengambil data gempa berdasarkan id',
            data,
        };
    }
    async getEarthquakeByAllData(dto) {
        const { start_date, end_date, min_magnitude, max_magnitude, min_depth, max_depth, min_lat, max_lat, min_long, max_long, min_mmi, max_mmi, } = dto;
        let query = this.supabase.from('earthquake').select('*');
        if (start_date) {
            query = query.gte('date_time', `${start_date}T00:00:00`);
        }
        if (end_date) {
            query = query.lte('date_time', `${end_date}T23:59:59`);
        }
        if (min_magnitude) {
            query = query.gte('magnitude', parseFloat(min_magnitude));
        }
        if (max_magnitude) {
            query = query.lte('magnitude', parseFloat(max_magnitude));
        }
        if (min_depth) {
            query = query.gte('depth', parseFloat(min_depth));
        }
        if (max_depth) {
            query = query.lte('depth', parseFloat(max_depth));
        }
        if (min_lat && max_lat && min_long && max_long) {
            query = query
                .gte('latitude', parseFloat(min_lat))
                .lte('latitude', parseFloat(max_lat))
                .gte('longitude', parseFloat(min_long))
                .lte('longitude', parseFloat(max_long));
        }
        const { data, error } = await query;
        if (error || !data) {
            return {
                success: false,
                message: 'Gagal mengambil data gempa berdasarkan filter tanggal, magnitude, dan kedalaman',
                error,
            };
        }
        const romanToInt = (roman) => {
            const map = {
                I: 1,
                II: 2,
                III: 3,
                IV: 4,
                V: 5,
                VI: 6,
                VII: 7,
                VIII: 8,
                IX: 9,
                X: 10,
                XI: 11,
                XII: 12,
            };
            return map[roman?.toUpperCase()] ?? 0;
        };
        let filteredData = data;
        if (min_mmi || max_mmi) {
            const minMMIInt = min_mmi ? romanToInt(min_mmi) : null;
            const maxMMIInt = max_mmi ? romanToInt(max_mmi) : null;
            if ((min_mmi && minMMIInt === null) || (max_mmi && maxMMIInt === null)) {
                filteredData = [];
            }
            else {
                filteredData = data.filter((item) => {
                    if (!item.mmi)
                        return false;
                    const mmiInt = romanToInt(item.mmi);
                    return ((minMMIInt === null || mmiInt >= minMMIInt) &&
                        (maxMMIInt === null || mmiInt <= maxMMIInt));
                });
            }
        }
        return {
            success: true,
            message: 'Berhasil mengambil data gempa berdasarkan filter tanggal, magnitude, dan kedalaman',
            data: filteredData,
        };
    }
};
exports.EarthquakeService = EarthquakeService;
exports.EarthquakeService = EarthquakeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        activity_log_service_1.ActivityLogService])
], EarthquakeService);
//# sourceMappingURL=earthquake.service.js.map