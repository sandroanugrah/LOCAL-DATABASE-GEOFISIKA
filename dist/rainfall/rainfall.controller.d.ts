import { Request } from 'express';
import { RainfallService } from '@/rainfall/rainfall.service';
import { RainfallQueryDto } from '@/rainfall/dto/rainfallQueryDto';
import { EditRainfallDto } from '@/rainfall/dto/edit-rainfall.dto';
import { CreateRainfallDto } from '@/rainfall/dto/create-rainfall.dto';
import { GetRainfallQueryDto } from '@/rainfall/dto/getRainfallQueryDto';
import { FilterRainfallByDateDto } from '@/rainfall/dto/filterRainfallByDateDto';
import { CreateRainfallExcelDto } from '@/rainfall/dto/create-rainfall-excel.dto';
export declare class RainfallController {
    private readonly rainfallService;
    constructor(rainfallService: RainfallService);
    saveRainfall(req: Request, userId: string, dto: CreateRainfallDto): Promise<{
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
    saveRainfallExcel(req: Request, userId: string, dto: CreateRainfallExcelDto): Promise<{
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
    updateRainfall(req: Request, dto: EditRainfallDto, querys: RainfallQueryDto): Promise<{
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
    deleteRainfall(req: Request, querys: RainfallQueryDto): Promise<{
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
    getAllRainfall(): Promise<{
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
    getRainfallById(querys: GetRainfallQueryDto): Promise<{
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
    getRainfallByDate(query: FilterRainfallByDateDto): Promise<{
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
