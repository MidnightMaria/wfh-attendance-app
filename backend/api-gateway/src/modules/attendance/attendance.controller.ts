import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Express } from 'express';
import { AttendanceService } from './attendance.service';

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  checkIn(
    @Body() body: any,
    @Headers('authorization') authorization?: string,
  ) {
    return this.attendanceService.checkIn(body, authorization);
  }

  @Post('check-in-with-photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
    }),
  )
  checkInWithPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Headers('authorization') authorization?: string,
  ) {
    return this.attendanceService.checkInWithPhoto(body, file, authorization);
  }

  @Get()
  findAll(
    @Headers('authorization') authorization?: string,
    @Query('employee_id') employeeId?: string,
    @Query('attendance_date') attendanceDate?: string,
  ) {
    return this.attendanceService.findAll(
      authorization,
      employeeId,
      attendanceDate,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authorization?: string,
  ) {
    return this.attendanceService.findOne(id, authorization);
  }
}