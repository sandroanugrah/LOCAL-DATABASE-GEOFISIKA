import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateHumidityDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({ description: 'Kelembapan pada pukul 07:00', example: 72.1 })
  @IsNotEmpty()
  @IsNumber()
  humidity_07: number;

  @ApiProperty({ description: 'Kelembapan pada pukul 13:00', example: 78.3 })
  @IsNotEmpty()
  @IsNumber()
  humidity_13: number;

  @ApiProperty({ description: 'Kelembapan pada pukul 18:00', example: 74.6 })
  @IsNotEmpty()
  @IsNumber()
  humidity_18: number;

  @ApiProperty({ description: 'Tanggal', example: '2025-01-01' })
  @IsNotEmpty()
  @IsString()
  date: string;
}
