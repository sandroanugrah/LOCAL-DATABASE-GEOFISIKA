import { Request } from 'express';
import { EarthquakeService } from '@/earthquake/earthquake.service';
import { EarthquakeQueryDto } from '@/earthquake/dto/earthquakeQueryDto';
import { EditEarthquakeDto } from '@/earthquake/dto/edit-earthquake.dto';
import { CreateEarthquakeDto } from '@/earthquake/dto/create-earthquake.dto';
import { GetEarthquakeQueryDto } from '@/earthquake/dto/getEarthquakeQueryDto';
import { FilterEarthquakeByDateDto } from '@/earthquake/dto/filterEarthquakeByDateDto';
import { CreateEarthquakeParseDto } from '@/earthquake/dto/create-earthquake-parse.dto';
import { CreateEarthquakeExcelDto } from '@/earthquake/dto/create-earthquake-excel.dto';
export declare class EarthquakeController {
    private readonly earthquakeService;
    constructor(earthquakeService: EarthquakeService);
    saveEarthquake(req: Request, userId: string, dto: CreateEarthquakeDto): Promise<{
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
        data: any[];
        error?: undefined;
    }>;
    saveEarthquakeExcel(req: Request, userId: string, dto: CreateEarthquakeExcelDto): Promise<{
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
    saveEarthquakeParse(req: Request, userId: string, dto: CreateEarthquakeParseDto): Promise<{
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
        data: any[];
        error?: undefined;
    }>;
    updateEarthquake(req: Request, dto: EditEarthquakeDto, querys: EarthquakeQueryDto): Promise<{
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
        data: any[];
        error?: undefined;
    }>;
    deleteEarthquake(req: Request, querys: EarthquakeQueryDto): Promise<{
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
        data: any;
        error?: undefined;
    }>;
    getAllEarthquake(): Promise<{
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
    getEarthquakeById(querys: GetEarthquakeQueryDto): Promise<{
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
    getEarthquakeByAllData(query: FilterEarthquakeByDateDto): Promise<{
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
