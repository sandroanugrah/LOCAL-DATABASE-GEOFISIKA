import { ConfigService } from '@nestjs/config';
import { ActivityLogService } from '@/activity-log/activity-log.service';
import { EditRainIntensityDto } from '@/rain-intensity/dto/edit-rain-intensity.dto';
import { CreateRainIntensityDto } from '@/rain-intensity/dto/create-rain-intensity.dto';
import { FilterRainIntensityByDateDto } from '@/rain-intensity/dto/filterRainIntensityByDateDto';
import { CreateRainIntensityExcelDto } from '@/rain-intensity/dto/create-rain-intensity-excel.dto';
export declare class RainIntensityService {
    private configService;
    private activityLogService;
    private supabase;
    constructor(configService: ConfigService, activityLogService: ActivityLogService);
    private getAdminData;
    private decodeBase64ToExcel;
    private parseExcelToData;
    private formatDateToPostgres;
    saveRainIntensity(dto: CreateRainIntensityDto, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        error: import("@supabase/storage-js").StorageError;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    saveExcelRainIntensity(dto: CreateRainIntensityExcelDto, ipAddress: string, userAgent: string): Promise<{
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
    updateRainIntensity(dto: EditRainIntensityDto, ipAddress: string, userAgent: string): Promise<{
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
        error: import("@supabase/storage-js").StorageError;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    deleteRainIntensity(id: number, user_id: string, ipAddress: string, userAgent: string): Promise<{
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
        error: import("@supabase/storage-js").StorageError;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any;
        error?: undefined;
    }>;
    getAllRainIntensity(): Promise<{
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
    getRainIntensityById(id: number): Promise<{
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
    getRainIntensityByDate(dto: FilterRainIntensityByDateDto): Promise<{
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
