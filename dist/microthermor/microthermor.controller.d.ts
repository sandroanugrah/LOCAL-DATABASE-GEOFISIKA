import { Request } from 'express';
import { MicrothermorService } from '@/microthermor/microthermor.service';
import { EditMicrothermorDto } from '@/microthermor/dto/edit-microthermor.dto';
import { MicrothermorQueryDto } from '@/microthermor/dto/microthermorQueryDto';
import { CreateMicrothermorDto } from '@/microthermor/dto/create-microthermor.dto';
import { GetMicrothermorQueryDto } from '@/microthermor/dto/getMicrothermorQueryDto';
import { GetMicrothermorQueryByMinMaxTDOMDto } from '@/microthermor/dto/getMicrothermorQueryByMinMaxTDOMDto';
export declare class MicrothermorController {
    private readonly microthermorService;
    constructor(microthermorService: MicrothermorService);
    saveMicrothermor(req: Request, userId: string, dto: CreateMicrothermorDto): Promise<{
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
    updateMicrothermor(req: Request, dto: EditMicrothermorDto, querys: MicrothermorQueryDto): Promise<{
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
    deleteMicrothermor(req: Request, querys: MicrothermorQueryDto): Promise<{
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
    getAllMicrothermor(): Promise<{
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
    getMicrothermorById(querys: GetMicrothermorQueryDto): Promise<{
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
    getMicrothermorByMaxMinTDOM(query: GetMicrothermorQueryByMinMaxTDOMDto): Promise<{
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
