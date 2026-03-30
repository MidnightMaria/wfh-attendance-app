import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async checkIn(createAttendanceDto: CreateAttendanceDto) {
    const today = new Date();
    const attendanceDate = today.toISOString().split('T')[0];

    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        employee_id: createAttendanceDto.employee_id,
        attendance_date: attendanceDate,
      },
    });

    if (existingAttendance) {
      throw new BadRequestException('Employee has already checked in today');
    }

    const attendance = this.attendanceRepository.create({
      employee_id: createAttendanceDto.employee_id,
      attendance_date: attendanceDate,
      check_in_time: new Date(),
      photo_path: createAttendanceDto.photo_path,
      note: createAttendanceDto.note,
    });

    return this.attendanceRepository.save(attendance);
  }

  async findAll() {
    return this.attendanceRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    return attendance;
  }
}