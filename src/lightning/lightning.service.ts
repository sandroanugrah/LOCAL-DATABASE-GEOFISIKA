import { Buffer } from 'buffer';
import * as dotenv from 'dotenv';
import * as ExcelJS from 'exceljs';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { EditLightningDto } from '@/lightning/dto/edit-lightning.dto';
import { ActivityLogService } from '@/activity-log/activity-log.service';
import { CreateLightningDto } from '@/lightning/dto/create-lightning.dto';
import { GetLightningQueryDto } from '@/lightning/dto/getLightningQueryDto';
import { LightningDataExcel } from '@/lightning/interfaces/LightningDataExcel';
import { FilterLightningByDateDto } from '@/lightning/dto/filterLightningByDateDto';
import { CreateLightningExcelDto } from '@/lightning/dto/create-lightning-excel.dto';
import { CreateLightningQueryDto } from '@/lightning/dto/create-lightning-query-dto';
import { CreateLightningQueryExcelDto } from '@/lightning/dto/create-lightning-query-excel-dto';
import { FilterLightningByLightningDataDto } from '@/lightning/dto/filterLightningByLightningDataDto';

dotenv.config();

@Injectable()
export class LightningService {
  private supabase: SupabaseClient;

  constructor(
    private configService: ConfigService,
    private activityLogService: ActivityLogService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL atau Anon Key tidak ditemukan.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Mengambil data admin berdasarkan user_id
   */
  private async getAdminData(user_id: string) {
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

  /**
   * Mendecode base64 menjadi objek Excel
   */
  private async decodeBase64ToExcel(
    base64: string,
  ): Promise<ExcelJS.Workbook | null> {
    try {
      const buffer = Buffer.from(base64, 'base64');
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      return workbook;
    } catch (error) {
      console.error('Error decoding base64 to Excel:', error);
      return null;
    }
  }

  /**
   * Mengonversi data excel menjadi array objek
   */
  private parseExcelToData(workbook: ExcelJS.Workbook): LightningDataExcel[] {
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

  /**
   * Mengonversi tanggal dari berbagai format menjadi format YYYY-MM-DD
   */
  private formatDateToPostgres(date: string): string | null {
    // Validasi dan konversi format tanggal
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split('T')[0];
    }

    // Format tanggal MM/DD/YYYY
    const [month, day, year] = date.split('/');
    if (month && day && year && year.length === 4) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Format tanggal 1.1 (DD.MM)
    const [day2, month2] = date.split('.');
    if (day2 && month2) {
      const currentYear = new Date().getFullYear();
      return `${currentYear}-${month2.padStart(2, '0')}-${day2.padStart(2, '0')}`;
    }

    return null;
  }

  /**
   * Menyimpan data petir dan mencatat ke activity log
   */
  async saveLightning(
    dto: CreateLightningDto,
    dtoQuery: CreateLightningQueryDto,
    ipAddress: string,
    userAgent: string,
  ) {
    const { name, date, file_base64 } = dto;
    const { user_id, lightning_data } = dtoQuery;

    // 1. Ambil data admin
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

    // 2. Unggah ke Supabase Storage
    const fileName = `${uuidv4()}.jpg`;
    const bucketName = 'lightning';

    // 🔧 Perbaiki format base64 jika tidak standar
    let fixedBase64 = file_base64;
    if (fixedBase64.startsWith('data:@file/jpeg;base64,')) {
      fixedBase64 = fixedBase64.replace(
        'data:@file/jpeg;base64,',
        'data:image/jpeg;base64,',
      );
    }

    // Convert base64 ke Buffer
    const base64Data = fixedBase64.replace(/^data:image\/\w+;base64,/, '');
    const fileBuffer = Buffer.from(base64Data, 'base64');

    // Unggah ke Supabase
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

    // 3. Ambil URL publik dari file yang diunggah
    const { data: publicUrlData } = this.supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    // 4. Simpan data petir
    const { data: lightningDataInserted, error: insertError } =
      await this.supabase
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

    // 5. Mencatat ke activity log
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

  /**
   * Menyimpan data excel petir dan mencatat ke activity log
   */
  async saveExcelLightning(
    dto: CreateLightningExcelDto,
    dtoQuery: CreateLightningQueryExcelDto,
    ipAddress: string,
    userAgent: string,
  ) {
    const { file_base64 } = dto;
    const { user_id, lightning_data } = dtoQuery;

    // 1. Ambil data admin
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

    // 2. Decode base64 ke file Excel
    const workbook = await this.decodeBase64ToExcel(file_base64);
    if (!workbook) {
      return {
        success: false,
        message: 'Gagal mendecode base64 menjadi file Excel',
      };
    }

    // 3. Parse Excel menjadi objek
    const data = this.parseExcelToData(workbook);
    if (data.length === 0) {
      return {
        success: false,
        message: 'Data Excel kosong atau tidak valid',
      };
    }

    // 4. Format tanggal dan sesuaikan data untuk tabel
    const dataWithFormattedDate = data
      .map((row) => {
        if (
          row['tanggal']?.toString().toLowerCase() === 'tanggal' ||
          row['nama']?.toString().toLowerCase() === 'nama'
        ) {
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

    // Pastikan ada data yang valid sebelum dilanjutkan
    if (dataWithFormattedDate.length === 0) {
      return {
        success: false,
        message: 'Tidak ada data valid untuk disimpan',
      };
    }

    // 5. Simpan data petir ke dalam tabel 'lightning'
    const { data: insertedLightning, error: lightningError } =
      await this.supabase
        .from('lightning')
        .insert(dataWithFormattedDate)
        .select();

    if (
      lightningError ||
      !insertedLightning ||
      insertedLightning.length === 0
    ) {
      return {
        success: false,
        message: 'Gagal menyimpan data petir',
        error: lightningError,
      };
    }

    // 6. Mencatat ke activity log
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

  /**
   * Mengubah data petir, mengupload file baru (jika ada) serta menghapus file lama di Supabase Storage
   * dan mencatat ke activity log.
   */
  async updateLightning(
    dto: EditLightningDto,
    ipAddress: string,
    userAgent: string,
  ) {
    const { id, user_id, name, date, file_base64 } = dto;

    // 1. Ambil data admin
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

    // 2. Ambil data petir saat ini
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

    // 3. Jika terdapat file baru, hapus file lama dan upload file baru
    if (file_base64) {
      // 🔧 Perbaiki format base64 jika tidak standar
      let fixedBase64 = file_base64;
      if (fixedBase64.startsWith('data:@file/jpeg;base64,')) {
        fixedBase64 = fixedBase64.replace(
          'data:@file/jpeg;base64,',
          'data:image/jpeg;base64,',
        );
      }

      // Jika file lama ada, hapus dari storage
      if (lightningData.file_url) {
        const parts = lightningData.file_url.split('/');
        const oldFileName = parts[parts.length - 1];

        await this.supabase.storage.from(bucketName).remove([oldFileName]);
      }

      // Upload file baru
      const newFileName = `${uuidv4()}.jpg`;
      const base64Data = fixedBase64.replace(/^data:image\/\w+;base64,/, '');
      const fileBuffer = Buffer.from(base64Data, 'base64');

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

      // Ambil URL publik dari file yang baru diunggah
      const { data: publicUrlData } = this.supabase.storage
        .from(bucketName)
        .getPublicUrl(newFileName);

      newFileUrl = publicUrlData.publicUrl;
    }

    // 4. Update data petir berdasarkan id
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

    // 5. Mencatat ke activity log
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

  /**
   * Menghapus data petir, hapus file baru (jika ada) di Supabase Storage
   * dan mencatat ke activity log.
   */
  async deleteLightning(
    id: number,
    user_id: string,
    ipAddress: string,
    userAgent: string,
  ) {
    // 1. Ambil data admin
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

    // 2. Ambil data petir untuk mendapatkan file_url
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

    // 3. Hapus file dari storage jika ada file_url
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

    // 4. Hapus data dari tabel petir
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

    // 5. Catat aktivitas penghapusan
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

  /**
   * Mengambil semua data petir berdasarkan id
   */
  async getLightningById(dto: GetLightningQueryDto) {
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

  /**
   * Mengambil data petir berdasarkan nama dan rentang tanggal (jika ada)
   */
  async getLightningByDate(dto: FilterLightningByDateDto) {
    const { lightning_data, start_date, end_date } = dto;

    // Mulai query dengan filter nama data petir
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

  /**
   * Mengambil data petir berdasarkan nama data
   */
  async getLightningByLightningData(dto: FilterLightningByLightningDataDto) {
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
}
