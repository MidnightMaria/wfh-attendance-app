import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
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

  @Get()
  findAll(@Headers('authorization') authorization?: string) {
    return this.attendanceService.findAll(authorization);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authorization?: string,
  ) {
    return this.attendanceService.findOne(id, authorization);
  }
}