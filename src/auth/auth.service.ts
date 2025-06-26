import { Buffer } from 'buffer';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginLogService } from '@/login-log/login-log.service';
import { TimeHelperService } from '@/helpers/time-helper.service';
import { ActivityLogService } from '@/activity-log/activity-log.service';
import { AdminUser, SignInResponse, SignUpResponse } from '@/auth/auth.types';

dotenv.config();

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  // Supabase Client
  constructor(
    private configService: ConfigService,
    private LoginLogService: LoginLogService,
    private timeHelperService: TimeHelperService,
    private activityLogService: ActivityLogService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL atau Anon Key tidak ditemukan.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Fungsi untuk mengambil role berdasarkan user_id
  private async getRoleByUserId(userId: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('admin')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) {
      throw new BadRequestException('Role pengguna tidak ditemukan.');
    }

    return data.role;
  }

  // Fungsi untuk mengambil data admin berdasarkan id_role
  private async getAdminDataByRole(id_role: string) {
    const { data, error } = await this.supabase
      .from('admin')
      .select('first_name, last_name')
      .eq('user_id', id_role)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) {
      throw new BadRequestException(
        'Data admin tidak ditemukan berdasarkan id_role.',
      );
    }

    return data;
  }

  // Fungsi untuk daftar admin atau operator
  async signUp(
    registerDto: RegisterDto,
    id_role: string,
    ip_address: string,
    user_agent: string,
  ): Promise<SignUpResponse> {
    const { email, password, first_name, last_name, file_base64, role } =
      registerDto;

    const fullName = `${first_name} ${last_name}`;

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    const user = data?.user;

    if (!user) {
      throw new BadRequestException('Gagal mendapatkan informasi pengguna.');
    }

    const adminData = await this.getAdminDataByRole(id_role);

    const firstNameFromDB = adminData.first_name;
    const lastNameFromDB = adminData.last_name;

    const timeZone = 'Asia/Jakarta';
    const date = new Date();

    const formattedCreatedAt = this.timeHelperService.formatCreatedAt(
      date,
      timeZone,
    );

    await this.activityLogService.logActivity({
      admin_id: id_role,
      action: 'Mendaftarkan Admin Atau Operator',
      description: `${firstNameFromDB} ${lastNameFromDB} mendaftarkan ${first_name} ${last_name} dengan email ${email}`,
      ip_address,
      user_agent,
      created_at: formattedCreatedAt,
    });

    // Upload file ke storage
    const fileName = `${uuidv4()}.jpg`;
    const bucketName = 'admin';
    const base64Data = file_base64.replace(/^data:image\/\w+;base64,/, '');
    const fileBuffer = Buffer.from(base64Data, 'base64');

    const { error: uploadError } = await this.supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      throw new BadRequestException(
        'Gagal mengunggah foto ke storage: ' + uploadError.message,
      );
    }

    // Ambil public URL file
    const { data: publicUrlData } = this.supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const photo = publicUrlData.publicUrl;

    // Simpan ke tabel admin
    const { data: dbData, error: dbError } = await this.supabase
      .from('admin')
      .insert([
        {
          email,
          first_name,
          last_name,
          photo,
          role,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (dbError) {
      throw new BadRequestException(dbError.message);
    }

    if (!dbData) {
      throw new BadRequestException('Gagal menyimpan data ke tabel admin.');
    }

    return {
      message: `${role} berhasil didaftarkan`,
      user: dbData as AdminUser,
    };
  }

  // Fungsi untuk login admin atau operator
  async signIn(
    loginDto: LoginDto,
    ip_address: string,
    user_agent: string,
  ): Promise<SignInResponse> {
    const { email, password } = loginDto;

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    const user = data?.user;
    const session = data?.session;

    if (!user || !session) {
      throw new BadRequestException('Gagal login, data tidak ditemukan.');
    }

    const role = await this.getRoleByUserId(user.id);

    const login_time = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Jakarta',
    });

    await this.LoginLogService.logLogin({
      admin_id: user.id,
      ip_address,
      user_agent,
      login_time: login_time,
    });

    return {
      message: 'Login berhasil',
      user_id: user.id,
      access_token: session.access_token,
      role: role,
    };
  }

  // Fungsi untuk logout admin atau operator
  async logout(): Promise<{ message: string }> {
    return {
      message: 'Logout berhasil',
    };
  }
}
