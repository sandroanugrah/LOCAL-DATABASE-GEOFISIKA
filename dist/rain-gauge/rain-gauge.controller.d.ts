import { Request } from 'express';
import { RainGaugeService } from '@/rain-gauge/rain-gauge.service';
import { RainGaugeQueryDto } from '@/rain-gauge/dto/rainGaugeQueryDto';
import { EditRainGaugeDto } from '@/rain-gauge/dto/edit-rain-gauge.dto';
import { FilterRainGaugeDto } from '@/rain-gauge/dto/filter-rain-gauge.dto';
import { CreateRainGaugeDto } from '@/rain-gauge/dto/create-rain-gauge.dto';
import { GetRainGaugeQueryDto } from '@/rain-gauge/dto/getRainGaugeQueryDto';
import { EditRainGaugeQueryDto } from '@/rain-gauge/dto/edit-rain-gauge-query.dto';
import { FilterRainGaugeByDateDto } from '@/rain-gauge/dto/filterRainGaugeByDateDto';
import { CreateRainGaugeExcelDto } from '@/rain-gauge/dto/create-rain-gauge-excel.dto';
import { CreateRainGaugeQueryDto } from '@/rain-gauge/dto/create-rain-gauge-query.dto';
import { CreateRainGaugeQueryExcelDto } from '@/rain-gauge/dto/create-rain-gauge-query-excel-dto';
export declare class RainGaugeController {
    private readonly rainGaugeService;
    constructor(rainGaugeService: RainGaugeService);
    saveRainGauge(req: Request, dtoQuery: CreateRainGaugeQueryDto, dto: CreateRainGaugeDto): Promise<{
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
        data: any;
        error?: undefined;
    }>;
    saveExcelRainGauge(req: Request, dtoQuery: CreateRainGaugeQueryExcelDto, dto: CreateRainGaugeExcelDto): Promise<{
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
    updateRainGauge(req: Request, dtoQuery: EditRainGaugeQueryDto, dto: EditRainGaugeDto): Promise<{
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
    deleteRainGauge(req: Request, querys: RainGaugeQueryDto): Promise<{
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
    getRainGaugeById(query: GetRainGaugeQueryDto): Promise<{
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
    getRainGaugeByDate(query: FilterRainGaugeByDateDto): Promise<{
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
    getRainGaugeByCityVillage(query: FilterRainGaugeDto): Promise<{
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
