import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AttendanceService {
  private readonly attendanceServiceUrl =
    process.env.ATTENDANCE_SERVICE_URL || 'http://attendance-service:3003';

  constructor(private readonly httpService: HttpService) {}

  private getAuthHeader(authorization?: string) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    return {
      Authorization: authorization,
    };
  }

  async checkIn(body: any, authorization?: string) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.attendanceServiceUrl}/attendances/check-in`,
        body,
        {
          headers: this.getAuthHeader(authorization),
        },
      ),
    );
    return response.data;
  }

  async findAll(authorization?: string) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.attendanceServiceUrl}/attendances`, {
        headers: this.getAuthHeader(authorization),
      }),
    );
    return response.data;
  }

  async findOne(id: number, authorization?: string) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.attendanceServiceUrl}/attendances/${id}`, {
        headers: this.getAuthHeader(authorization),
      }),
    );
    return response.data;
  }
}