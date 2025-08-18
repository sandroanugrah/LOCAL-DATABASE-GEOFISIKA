import { Request } from 'express';
import { RainIntensityService } from '@/rain-intensity/rain-intensity.service';
import { RainIntensityQueryDto } from '@/rain-intensity/dto/rainIntensityQueryDto';
import { EditRainIntensityDto } from '@/rain-intensity/dto/edit-rain-intensity.dto';
import { CreateRainIntensityDto } from '@/rain-intensity/dto/create-rain-intensity.dto';
import { GetRainIntensityQueryDto } from '@/rain-intensity/dto/getRainIntensityQueryDto';
import { FilterRainIntensityByDateDto } from '@/rain-intensity/dto/filterRainIntensityByDateDto';
import { CreateRainIntensityExcelDto } from '@/rain-intensity/dto/create-rain-intensity-excel.dto';
export declare class RainIntensityController {
    private readonly rainIntensityService;
    constructor(rainIntensityService: RainIntensityService);
    saveRainIntensity(req: Request, userId: string, dto: CreateRainIntensityDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | undefined;
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
    saveRainIntensityExcel(req: Request, userId: string, dto: CreateRainIntensityExcelDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | null;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    updateRainIntensity(req: Request, dto: EditRainIntensityDto, querys: RainIntensityQueryDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | null;
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
    deleteRainIntensity(req: Request, querys: RainIntensityQueryDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | null;
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
        error: import("@supabase/postgrest-js").PostgrestError;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    getRainIntensityById(querys: GetRainIntensityQueryDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | null;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any;
        error?: undefined;
    }>;
    getRainIntensityByDate(query: FilterRainIntensityByDateDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
}
