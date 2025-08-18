import { Request } from 'express';
import { WindDirectionAndSpeedService } from '@/wind-direction-and-speed/wind-direction-and-speed.service';
import { WindDirectionAndSpeedQueryDto } from '@/wind-direction-and-speed/dto/windDirectionAndSpeedQueryDto';
import { EditWindDirectionAndSpeedDto } from '@/wind-direction-and-speed/dto/edit-wind-direction-and-speed.dto';
import { GetWindDirectionAndSpeedQueryDto } from '@/wind-direction-and-speed/dto/getWindDirectionAndSpeedQueryDto';
import { CreateWindDirectionAndSpeedDto } from '@/wind-direction-and-speed/dto/create-wind-direction-and-speed.dto';
import { FilterWindDirectionAndSpeedByDateDto } from '@/wind-direction-and-speed/dto/filterWindDirectionAndSpeedByDateDto';
import { CreateWindDirectionAndSpeedExcelDto } from '@/wind-direction-and-speed/dto/create-wind-direction-and-speed-excel.dto';
export declare class WindDirectionAndSpeedController {
    private readonly windDirectionAndSpeedService;
    constructor(windDirectionAndSpeedService: WindDirectionAndSpeedService);
    saveWindDirectionAndSpeed(req: Request, userId: string, dto: CreateWindDirectionAndSpeedDto): Promise<{
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
    saveExcelWindDirectionAndSpeed(req: Request, userId: string, dto: CreateWindDirectionAndSpeedExcelDto): Promise<{
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
    updateWindDirectionAndSpeed(req: Request, dto: EditWindDirectionAndSpeedDto, querys: WindDirectionAndSpeedQueryDto): Promise<{
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
    deleteWindDirectionAndSpeed(req: Request, querys: WindDirectionAndSpeedQueryDto): Promise<{
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
    getAllWindDirectionAndSpeed(): Promise<{
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
    getWindDirectionAndSpeedById(querys: GetWindDirectionAndSpeedQueryDto): Promise<{
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
    getWindDirectionAndSpeedByDate(query: FilterWindDirectionAndSpeedByDateDto): Promise<{
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
