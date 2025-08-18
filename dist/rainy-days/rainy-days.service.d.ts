import { ConfigService } from '@nestjs/config';
import { EditRainyDaysDto } from '@/rainy-days/dto/edit-rainy-days.dto';
import { ActivityLogService } from '@/activity-log/activity-log.service';
import { CreateRainyDaysDto } from '@/rainy-days/dto/create-rainy-days.dto';
import { FilterRainyDaysByDateDto } from '@/rainy-days/dto/filterRainyDaysByDateDto';
import { CreateRainyDaysExcelDto } from '@/rainy-days/dto/create-rainy-days-excel.dto';
export declare class RainyDaysService {
    private configService;
    private activityLogService;
    private supabase;
    constructor(configService: ConfigService, activityLogService: ActivityLogService);
    private getAdminData;
    private decodeBase64ToExcel;
    private parseExcelToData;
    private formatDateToPostgres;
    saveRainyDays(dto: CreateRainyDaysDto, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    saveExcelRainyDays(dto: CreateRainyDaysExcelDto, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | null;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    updateRainyDays(dto: EditRainyDaysDto, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    deleteRainyDays(id: number, user_id: string, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any;
        error?: undefined;
    }>;
    getAllRainyDays(): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    getRainyDaysById(id: number): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | null;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any;
        error?: undefined;
    }>;
    getRainyDaysByDate(dto: FilterRainyDaysByDateDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
}
