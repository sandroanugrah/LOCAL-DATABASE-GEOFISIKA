import { ConfigService } from '@nestjs/config';
import { EditLightningDto } from '@/lightning/dto/edit-lightning.dto';
import { ActivityLogService } from '@/activity-log/activity-log.service';
import { CreateLightningDto } from '@/lightning/dto/create-lightning.dto';
import { GetLightningQueryDto } from '@/lightning/dto/getLightningQueryDto';
import { FilterLightningByDateDto } from '@/lightning/dto/filterLightningByDateDto';
import { CreateLightningExcelDto } from '@/lightning/dto/create-lightning-excel.dto';
import { CreateLightningQueryDto } from '@/lightning/dto/create-lightning-query-dto';
import { CreateLightningQueryExcelDto } from '@/lightning/dto/create-lightning-query-excel-dto';
import { FilterLightningByLightningDataDto } from '@/lightning/dto/filterLightningByLightningDataDto';
export declare class LightningService {
    private configService;
    private activityLogService;
    private supabase;
    constructor(configService: ConfigService, activityLogService: ActivityLogService);
    private getAdminData;
    private decodeBase64ToExcel;
    private parseExcelToData;
    private formatDateToPostgres;
    saveLightning(dto: CreateLightningDto, dtoQuery: CreateLightningQueryDto, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | undefined;
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
    saveExcelLightning(dto: CreateLightningExcelDto, dtoQuery: CreateLightningQueryExcelDto, ipAddress: string, userAgent: string): Promise<{
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
    updateLightning(dto: EditLightningDto, ipAddress: string, userAgent: string): Promise<{
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
    deleteLightning(id: number, user_id: string, ipAddress: string, userAgent: string): Promise<{
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
    getLightningById(dto: GetLightningQueryDto): Promise<{
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
    getLightningByDate(dto: FilterLightningByDateDto): Promise<{
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
    getLightningByLightningData(dto: FilterLightningByLightningDataDto): Promise<{
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
