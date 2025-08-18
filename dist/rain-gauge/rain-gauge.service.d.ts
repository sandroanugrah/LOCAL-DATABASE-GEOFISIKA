import { ConfigService } from '@nestjs/config';
import { EditRainGaugeDto } from '@/rain-gauge/dto/edit-rain-gauge.dto';
import { ActivityLogService } from '@/activity-log/activity-log.service';
import { FilterRainGaugeDto } from '@/rain-gauge/dto/filter-rain-gauge.dto';
import { CreateRainGaugeDto } from '@/rain-gauge/dto/create-rain-gauge.dto';
import { GetRainGaugeQueryDto } from '@/rain-gauge/dto/getRainGaugeQueryDto';
import { EditRainGaugeQueryDto } from '@/rain-gauge/dto/edit-rain-gauge-query.dto';
import { FilterRainGaugeByDateDto } from '@/rain-gauge/dto/filterRainGaugeByDateDto';
import { CreateRainGaugeQueryDto } from '@/rain-gauge/dto/create-rain-gauge-query.dto';
import { CreateRainGaugeExcelDto } from '@/rain-gauge/dto/create-rain-gauge-excel.dto';
import { CreateRainGaugeQueryExcelDto } from '@/rain-gauge/dto/create-rain-gauge-query-excel-dto';
export declare class RainGaugeService {
    private configService;
    private activityLogService;
    private supabase;
    constructor(configService: ConfigService, activityLogService: ActivityLogService);
    private getAdminData;
    saveRainGauge(dto: CreateRainGaugeDto, dtoQuery: CreateRainGaugeQueryDto, ipAddress: string, userAgent: string): Promise<{
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
        data: any;
        error?: undefined;
    }>;
    private formatDateToPostgres;
    private decodeBase64ToExcel;
    private parseExcelToData;
    saveExcelRainGauge(dto: CreateRainGaugeExcelDto, dtoQuery: CreateRainGaugeQueryExcelDto, ipAddress: string, userAgent: string): Promise<{
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
    findAll(filter: FilterRainGaugeDto): Promise<any[]>;
    updateRainGauge(dto: EditRainGaugeDto, dtoQuery: EditRainGaugeQueryDto, ipAddress: string, userAgent: string): Promise<{
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
        data: any;
        error?: undefined;
    }>;
    deleteRainGauge(id: number, user_id: string, ipAddress: string, userAgent: string): Promise<{
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
    getRainGaugeById(dto: GetRainGaugeQueryDto): Promise<{
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
    getRainGaugeByDate(dto: FilterRainGaugeByDateDto): Promise<{
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
    getRainGaugeByCityVillage(dto: FilterRainGaugeDto): Promise<{
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
