import { IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  photo_path?: string;
}