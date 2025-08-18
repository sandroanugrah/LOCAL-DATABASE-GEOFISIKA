import { Request } from 'express';
import { MaxTemperatureService } from '@/max-temperature/max-temperature.service';
import { MaxTemperatureQueryDto } from '@/max-temperature/dto/maxTemperatureQueryDto';
import { EditMaxTemperatureDto } from '@/max-temperature/dto/edit-max-temperature.dto';
import { CreateMaxTemperatureDto } from '@/max-temperature/dto/create-max-temperature.dto';
import { GetMaxTemperatureQueryDto } from '@/max-temperature/dto/getMaxTemperatureQueryDto';
import { FilterMaxTemperatureByDateDto } from '@/max-temperature/dto/filterMaxTemperatureByDateDto';
import { CreateMaxTemperatureExcelDto } from '@/max-temperature/dto/create-max-temperature-excel.dto';
export declare class MaxTemperatureController {
    private readonly maxTemperatureService;
    constructor(maxTemperatureService: MaxTemperatureService);
    saveMaxTemperature(req: Request, userId: string, dto: CreateMaxTemperatureDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any;
        error?: undefined;
    }>;
    saveMaxTemperatureExcel(req: Request, userId: string, dto: CreateMaxTemperatureExcelDto): Promise<{
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
    updateMaxTemperature(req: Request, dto: EditMaxTemperatureDto, querys: MaxTemperatureQueryDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any;
        error?: undefined;
    }>;
    deleteMaxTemperature(req: Request, querys: MaxTemperatureQueryDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any;
        error?: undefined;
    }>;
    getAllMaxTemperature(): Promise<{
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
    getMaxTemperatureById(querys: GetMaxTemperatureQueryDto): Promise<{
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
    getMaxTemperatureByDate(query: FilterMaxTemperatureByDateDto): Promise<{
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
