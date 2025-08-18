import { Request } from 'express';
import { AirPressureService } from '@/air-pressure/air-pressure.service';
import { AirPressureQueryDto } from '@/air-pressure/dto/airPressureQueryDto';
import { EditAirPressureDto } from '@/air-pressure/dto/edit-air-pressure.dto';
import { CreateAirPressureDto } from '@/air-pressure/dto/create-air-pressure.dto';
import { GetAirPressureQueryDto } from '@/air-pressure/dto/getAirPressureQueryDto';
import { FilterAirPressureByDateDto } from '@/air-pressure/dto/filterAirPressureByDateDto';
import { CreateAirPressureExcelDto } from '@/air-pressure/dto/create-air-pressure-excel.dto';
export declare class AirPressureController {
    private readonly airPressureService;
    constructor(airPressureService: AirPressureService);
    saveAirPressure(req: Request, userId: string, dto: CreateAirPressureDto): Promise<{
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
    saveaAirPressureExcel(req: Request, userId: string, dto: CreateAirPressureExcelDto): Promise<{
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
    updateAirPressure(req: Request, dto: EditAirPressureDto, querys: AirPressureQueryDto): Promise<{
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
    deleteAirPressure(req: Request, querys: AirPressureQueryDto): Promise<{
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
    getAllAirPressure(): Promise<{
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
    getAirPressure(querys: GetAirPressureQueryDto): Promise<{
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
    getAirPressureByDate(query: FilterAirPressureByDateDto): Promise<{
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
