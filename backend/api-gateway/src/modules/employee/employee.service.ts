import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmployeeService {
  private readonly employeeServiceUrl =
    process.env.EMPLOYEE_SERVICE_URL || 'http://employee-service:3002';

  constructor(private readonly httpService: HttpService) {}

  private getAuthHeader(authorization?: string) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    return {
      Authorization: authorization,
    };
  }

  async create(body: any, authorization?: string) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.employeeServiceUrl}/employees`, body, {
        headers: this.getAuthHeader(authorization),
      }),
    );
    return response.data;
  }

  async findAll(authorization?: string) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.employeeServiceUrl}/employees`, {
        headers: this.getAuthHeader(authorization),
      }),
    );
    return response.data;
  }

  async findOne(id: number, authorization?: string) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.employeeServiceUrl}/employees/${id}`, {
        headers: this.getAuthHeader(authorization),
      }),
    );
    return response.data;
  }
}