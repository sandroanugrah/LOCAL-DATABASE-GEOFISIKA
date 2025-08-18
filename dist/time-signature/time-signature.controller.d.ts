import { Request } from 'express';
import { TimeSignatureService } from '@/time-signature/time-signature.service';
import { TimeSignatureQueryDto } from '@/time-signature/dto/timeSignatureQueryDto';
import { EditTimeSignatureDto } from '@/time-signature/dto/edit-time-signature.dto';
import { CreateTimeSignatureDto } from '@/time-signature/dto/create-time-signature.dto';
import { GetTimeSignatureQueryDto } from '@/time-signature/dto/getTimeSignatureQueryDto';
import { FilterTimeSignatureByDateDto } from '@/time-signature/dto/filterTimeSignatureByDateDto';
import { CreateTimeSignatureExcelDto } from '@/time-signature/dto/create-time-signature-excel.dto';
export declare class TimeSignatureController {
    private readonly timeSignatureService;
    constructor(timeSignatureService: TimeSignatureService);
    saveTimeSignature(req: Request, userId: string, dto: CreateTimeSignatureDto): Promise<{
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
    saveTimeSignatureExcel(req: Request, userId: string, dto: CreateTimeSignatureExcelDto): Promise<{
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
    updateTimeSignature(req: Request, dto: EditTimeSignatureDto, querys: TimeSignatureQueryDto): Promise<{
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
    deleteTimeSignature(req: Request, querys: TimeSignatureQueryDto): Promise<{
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
    getAllTimeSignature(): Promise<{
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
    getMinTemperatureById(querys: GetTimeSignatureQueryDto): Promise<{
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
    getTimeSignatureByDate(query: FilterTimeSignatureByDateDto): Promise<{
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
