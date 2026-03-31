import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @ApiPropertyOptional({ example: 'Working from home today' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ example: 'uploads/attendance-123.jpg' })
  @IsOptional()
  @IsString()
  photo_path?: string;
}