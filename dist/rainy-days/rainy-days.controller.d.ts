import { Request } from 'express';
import { RainyDaysService } from '@/rainy-days/rainy-days.service';
import { RainyDaysQueryDto } from '@/rainy-days/dto/rainyDaysQueryDto';
import { EditRainyDaysDto } from '@/rainy-days/dto/edit-rainy-days.dto';
import { CreateRainyDaysDto } from '@/rainy-days/dto/create-rainy-days.dto';
import { GetRainyDaysQueryDto } from '@/rainy-days/dto/getRainyDaysQueryDto';
import { FilterRainyDaysByDateDto } from '@/rainy-days/dto/filterRainyDaysByDateDto';
import { CreateRainyDaysExcelDto } from '@/rainy-days/dto/create-rainy-days-excel.dto';
export declare class RainyDaysController {
    private readonly rainyDaysService;
    constructor(rainyDaysService: RainyDaysService);
    saveRainyDays(req: Request, userId: string, dto: CreateRainyDaysDto): Promise<{
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
    saveRainyDaysExcel(req: Request, userId: string, dto: CreateRainyDaysExcelDto): Promise<{
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
    updateRainyDays(req: Request, dto: EditRainyDaysDto, querys: RainyDaysQueryDto): Promise<{
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
    deleteRainyDays(req: Request, querys: RainyDaysQueryDto): Promise<{
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
    getAllRainyDays(): Promise<{
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
    getRainyDaysById(querys: GetRainyDaysQueryDto): Promise<{
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
    getRainyDaysByDate(query: FilterRainyDaysByDateDto): Promise<{
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
