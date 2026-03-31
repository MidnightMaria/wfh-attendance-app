import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';

import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EMPLOYEE')
  @Post('check-in')
  checkIn(@Req() req: any, @Body() createAttendanceDto: CreateAttendanceDto) {
    const employeeId = req.user?.employee_id;

    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }

    return this.attendanceService.checkIn(employeeId, createAttendanceDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EMPLOYEE')
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
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() createAttendanceDto: CreateAttendanceDto,
  ) {
    const employeeId = req.user?.employee_id;

    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }

    return this.attendanceService.checkIn(employeeId, {
      ...createAttendanceDto,
      photo_path: file ? file.path : undefined,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll(
    @Query('employee_id') employeeId?: string,
    @Query('attendance_date') attendanceDate?: string,
  ) {
    return this.attendanceService.findAll(
      employeeId ? parseInt(employeeId, 10) : undefined,
      attendanceDate,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id);
  }
}