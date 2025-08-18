import { Request } from 'express';
import { EvaporationService } from '@/evaporation/evaporation.service';
import { EditEvaporationDto } from '@/evaporation/dto/edit-evaporation.dto';
import { EvaporationQueryDto } from '@/evaporation/dto/qevaporationQueryDto';
import { CreateEvaporationDto } from '@/evaporation/dto/create-evaporation.dto';
import { GetEvaporationQueryDto } from '@/evaporation/dto/getEvaporationQueryDto';
import { FilterEvaporationByDateDto } from '@/evaporation/dto/filterEvaporationByDateDto';
import { CreateEvaporationExcelDto } from '@/evaporation/dto/create-evaporation-excel.dto';
export declare class EvaporationController {
    private readonly evaporationService;
    constructor(evaporationService: EvaporationService);
    saveEvaporation(req: Request, userId: string, dto: CreateEvaporationDto): Promise<{
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
    saveEvaporationExcel(req: Request, userId: string, dto: CreateEvaporationExcelDto): Promise<{
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
    updateEvaporation(req: Request, dto: EditEvaporationDto, querys: EvaporationQueryDto): Promise<{
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
    deleteEvaporation(req: Request, querys: EvaporationQueryDto): Promise<{
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
    getAllEvaporation(): Promise<{
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
    getEvaporationById(querys: GetEvaporationQueryDto): Promise<{
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
    getEvaporationByDate(query: FilterEvaporationByDateDto): Promise<{
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
