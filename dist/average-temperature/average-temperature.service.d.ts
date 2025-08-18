import { ConfigService } from '@nestjs/config';
import { ActivityLogService } from '@/activity-log/activity-log.service';
import { EditAverageTemperatureDto } from '@/average-temperature/dto/edit-average-temperature.dto';
import { CreateAverageTemperatureDto } from '@/average-temperature/dto/create-average-temperature.dto';
import { FilterAverageTemperatureByDateDto } from '@/average-temperature/dto/filterAverageTemperatureByDateDto';
import { CreateAverageTemperatureExcelDto } from '@/average-temperature/dto/create-average-temperature-excel.dto';
export declare class AverageTemperatureService {
    private configService;
    private activityLogService;
    private supabase;
    constructor(configService: ConfigService, activityLogService: ActivityLogService);
    private getAdminData;
    private decodeBase64ToExcel;
    private parseExcelToData;
    private formatDateToPostgres;
    saveAverageTemperature(dto: CreateAverageTemperatureDto, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    saveExcelAverageTemperature(dto: CreateAverageTemperatureExcelDto, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | null;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    updateAverageTemperature(dto: EditAverageTemperatureDto, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    deleteAverageTemperature(id: number, user_id: string, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | undefined;
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
        error: import("@supabase/supabase-js").PostgrestError;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
    getAverageTemperatureById(id: number): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError | null;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any;
        error?: undefined;
    }>;
    getAverageTemperatureByDate(dto: FilterAverageTemperatureByDateDto): Promise<{
        success: boolean;
        message: string;
        error: import("@supabase/supabase-js").PostgrestError;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    }>;
}
