import { Request } from 'express';
import { MinTemperatureService } from '@/min-temperature/min-temperature.service';
import { MinTemperatureQueryDto } from '@/min-temperature/dto/minTemperatureQueryDto';
import { EditMinTemperatureDto } from '@/min-temperature/dto/edit-min-temperature.dto';
import { CreateMinTemperatureDto } from '@/min-temperature/dto/create-min-temperature.dto';
import { GetMinTemperatureQueryDto } from '@/min-temperature/dto/getMinTemperatureQueryDto';
import { FilterMinTemperatureByDateDto } from '@/min-temperature/dto/filterMinTemperatureByDateDto';
import { CreateMinTemperatureExcelDto } from '@/min-temperature/dto/create-min-temperature-excel.dto';
export declare class MinTemperatureController {
    private readonly minTemperatureService;
    constructor(minTemperatureService: MinTemperatureService);
    saveMinTemperature(req: Request, userId: string, dto: CreateMinTemperatureDto): Promise<{
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
    saveMinTemperatureExcel(req: Request, userId: string, dto: CreateMinTemperatureExcelDto): Promise<{
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
    updateMinTemperature(req: Request, dto: EditMinTemperatureDto, querys: MinTemperatureQueryDto): Promise<{
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
    deleteMinTemperature(req: Request, querys: MinTemperatureQueryDto): Promise<{
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
    getAllMinTemperature(): Promise<{
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
    getMinTemperatureById(querys: GetMinTemperatureQueryDto): Promise<{
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
    getMinTemperatureByDate(query: FilterMinTemperatureByDateDto): Promise<{
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
