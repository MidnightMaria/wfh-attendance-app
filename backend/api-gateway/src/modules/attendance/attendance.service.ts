import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import type { Express } from 'express';
import { handleServiceError } from '../../common/utils/handle-service-error';

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
    try {
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
    } catch (error) {
      handleServiceError(error);
    }
  }

  async checkInWithPhoto(
    body: any,
    file: Express.Multer.File,
    authorization?: string,
  ) {
    try {
      const formData = new FormData();

      if (body.note) {
        formData.append('note', body.note);
      }

      if (file) {
        formData.append('photo', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      }

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.attendanceServiceUrl}/attendances/check-in-with-photo`,
          formData,
          {
            headers: {
              ...this.getAuthHeader(authorization),
              ...formData.getHeaders(),
            },
            maxBodyLength: Infinity,
          },
        ),
      );

      return response.data;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async findAll(
    authorization?: string,
    employeeId?: string,
    attendanceDate?: string,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.attendanceServiceUrl}/attendances`, {
          headers: this.getAuthHeader(authorization),
          params: {
            employee_id: employeeId,
            attendance_date: attendanceDate,
          },
        }),
      );
      return response.data;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async findOne(id: number, authorization?: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.attendanceServiceUrl}/attendances/${id}`, {
          headers: this.getAuthHeader(authorization),
        }),
      );
      return response.data;
    } catch (error) {
      handleServiceError(error);
    }
  }
}