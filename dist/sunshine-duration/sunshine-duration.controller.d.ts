import { Request } from 'express';
import { SunshineDurationService } from '@/sunshine-duration/sunshine-duration.service';
import { SunshineDurationQueryDto } from '@/sunshine-duration/dto/sunshineDurationQueryDto';
import { EditSunshineDurationDto } from '@/sunshine-duration/dto/edit-sunshine-duration.dto';
import { CreateSunshineDurationDto } from '@/sunshine-duration/dto/create-sunshine-duration.dto';
import { GetSunshineDurationQueryDto } from '@/sunshine-duration/dto/getSunshineDurationQueryDto';
import { FilterSunShineDurationByDateDto } from '@/sunshine-duration/dto/filterSunShineDurationByDateDto';
import { CreateSunshineDurationExcelDto } from '@/sunshine-duration/dto/create-sunshine-duration-excel.dto';
export declare class SunshineDurationController {
    private readonly sunshineDurationService;
    constructor(sunshineDurationService: SunshineDurationService);
    saveSunshineDuration(req: Request, userId: string, dto: CreateSunshineDurationDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    saveSunshineDurationExcel(req: Request, userId: string, dto: CreateSunshineDurationExcelDto): Promise<{
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
    updateSunshineDuration(req: Request, dto: EditSunshineDurationDto, querys: SunshineDurationQueryDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    deleteSunshineDuration(req: Request, querys: SunshineDurationQueryDto): Promise<{
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
        data: any;
        error?: undefined;
    }>;
    getAllSunshineDuration(): Promise<{
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
    getSunshineDurationById(querys: GetSunshineDurationQueryDto): Promise<{
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
    getSunshineDurationByDate(query: FilterSunShineDurationByDateDto): Promise<{
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
