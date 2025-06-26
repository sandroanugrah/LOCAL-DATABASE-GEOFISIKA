import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateEarthquakeDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({
    description: 'Tanggal dan waktu kejadian gempa (ISO 8601)',
    example: '2025-05-01T14:32:00+07:00',
  })
  @IsNotEmpty()
  @IsDateString()
  date_time: string;

  @ApiProperty({ description: 'Intensitas gempa (MMI)', example: 'IV' })
  @IsNotEmpty()
  @IsString()
  mmi: string;

  @ApiProperty({
    description: 'Deskripsi singkat kejadian',
    example: 'Guncangan kuat dirasakan di kota A.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Kedalaman gempa dalam kilometer',
    example: 10.5,
  })
  @IsNotEmpty()
  @IsNumber()
  depth: number;

  @ApiProperty({ description: 'Latitude pusat gempa', example: -6.1751 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude pusat gempa', example: 106.865 })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty({ description: 'Magnitudo gempa', example: 5.2 })
  @IsNotEmpty()
  @IsNumber()
  magnitude: number;

  @ApiProperty({
    description: 'Nama pengamat atau pencatat',
    example: 'Badan Meteorologi A',
  })
  @IsNotEmpty()
  @IsString()
  observer_name: string;
}
