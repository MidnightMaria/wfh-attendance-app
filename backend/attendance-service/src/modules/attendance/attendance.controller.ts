import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  checkIn(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.checkIn(createAttendanceDto);
  }

  @Post('check-in-with-photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `attendance-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  checkInWithPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAttendanceDto: CreateAttendanceDto,
  ) {
    return this.attendanceService.checkIn({
      ...createAttendanceDto,
      photo_path: file ? file.path : undefined,
    });
  }

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id);
  }
}