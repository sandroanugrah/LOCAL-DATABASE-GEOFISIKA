import { Request } from 'express';
import { AverageTemperatureService } from '@/average-temperature/average-temperature.service';
import { AverageTemperatureQueryDto } from '@/average-temperature/dto/averageTemperatureQueryDto';
import { EditAverageTemperatureDto } from '@/average-temperature/dto/edit-average-temperature.dto';
import { CreateAverageTemperatureDto } from '@/average-temperature/dto/create-average-temperature.dto';
import { GetAverageTemperatureQueryDto } from '@/average-temperature/dto/getAverageTemperatureQueryDto';
import { FilterAverageTemperatureByDateDto } from '@/average-temperature/dto/filterAverageTemperatureByDateDto';
import { CreateAverageTemperatureExcelDto } from '@/average-temperature/dto/create-average-temperature-excel.dto';
export declare class AverageTemperatureController {
    private readonly averageTemperatureService;
    constructor(averageTemperatureService: AverageTemperatureService);
    saveAverageTemperature(req: Request, userId: string, dto: CreateAverageTemperatureDto): Promise<{
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
    saveaAverageTemperaturePressureExcel(req: Request, userId: string, dto: CreateAverageTemperatureExcelDto): Promise<{
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
    updateAverageTemperature(req: Request, dto: EditAverageTemperatureDto, querys: AverageTemperatureQueryDto): Promise<{
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
    deleteAverageTemperature(req: Request, querys: AverageTemperatureQueryDto): Promise<{
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
    getAllAverageTemperature(): Promise<{
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
    getAverageTemperatureById(querys: GetAverageTemperatureQueryDto): Promise<{
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
    getAverageTemperatureByDate(query: FilterAverageTemperatureByDateDto): Promise<{
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
