import { Request } from 'express';
import { LightningService } from '@/lightning/lightning.service';
import { LightningQueryDto } from '@/lightning/dto/lightningQueryDto';
import { EditLightningDto } from '@/lightning/dto/edit-lightning.dto';
import { CreateLightningDto } from '@/lightning/dto/create-lightning.dto';
import { GetLightningQueryDto } from '@/lightning/dto/getLightningQueryDto';
import { FilterLightningByDateDto } from '@/lightning/dto/filterLightningByDateDto';
import { CreateLightningExcelDto } from '@/lightning/dto/create-lightning-excel.dto';
import { CreateLightningQueryDto } from '@/lightning/dto/create-lightning-query-dto';
import { CreateLightningQueryExcelDto } from '@/lightning/dto/create-lightning-query-excel-dto';
import { FilterLightningByLightningDataDto } from '@/lightning/dto/filterLightningByLightningDataDto';
export declare class LightningController {
    private readonly lightningService;
    constructor(lightningService: LightningService);
    saveLightning(req: Request, dtoQuery: CreateLightningQueryDto, dto: CreateLightningDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/postgrest-js").PostgrestError | undefined;
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
    saveLightningExcel(req: Request, dtoQuery: CreateLightningQueryExcelDto, dto: CreateLightningExcelDto): Promise<{
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
    updateLightning(req: Request, dto: EditLightningDto, querys: LightningQueryDto): Promise<{
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
    deleteLightning(req: Request, querys: LightningQueryDto): Promise<{
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
    getLightning(querys: GetLightningQueryDto): Promise<{
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
    getLightningByDate(query: FilterLightningByDateDto): Promise<{
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
    getLightningByLightningData(query: FilterLightningByLightningDataDto): Promise<{
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
