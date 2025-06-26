import { ApiProperty } from '@nestjs/swagger';

export class RainyDaysQueryDto {
  @ApiProperty({ example: 1, description: 'ID data hari hujan' })
  id: number;

  @ApiProperty({
    example: 'user123',
    description: 'User ID dari admin atau operator yang menjadi pelaku aksi',
  })
  user_id: string;
}
