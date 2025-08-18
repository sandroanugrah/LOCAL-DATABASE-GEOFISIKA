import { ConfigService } from '@nestjs/config';
import { ActivityLogService } from '@/activity-log/activity-log.service';
import { EditSunshineDurationDto } from '@/sunshine-duration/dto/edit-sunshine-duration.dto';
import { CreateSunshineDurationDto } from '@/sunshine-duration/dto/create-sunshine-duration.dto';
import { FilterSunShineDurationByDateDto } from '@/sunshine-duration/dto/filterSunShineDurationByDateDto';
import { CreateSunshineDurationExcelDto } from '@/sunshine-duration/dto/create-sunshine-duration-excel.dto';
export declare class SunshineDurationService {
    private configService;
    private activityLogService;
    private supabase;
    constructor(configService: ConfigService, activityLogService: ActivityLogService);
    private getAdminData;
    private decodeBase64ToExcel;
    private parseExcelToData;
    private formatDateToPostgres;
    saveSunshineDuration(dto: CreateSunshineDurationDto, ipAddress: string, userAgent: string): Promise<{
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
    saveExcelSunshineDuration(dto: CreateSunshineDurationExcelDto, ipAddress: string, userAgent: string): Promise<{
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
    updateSunshineDuration(dto: EditSunshineDurationDto, ipAddress: string, userAgent: string): Promise<{
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
    deleteSunshineDuration(id: number, user_id: string, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | undefined;
        data?: undefined;
    } | {
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
    getAllSunshineDuration(): Promise<{
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
    getSunshineDurationById(id: number): Promise<{
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
    getSunshineDurationByDate(dto: FilterSunShineDurationByDateDto): Promise<{
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
