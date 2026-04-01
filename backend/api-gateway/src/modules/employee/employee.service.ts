import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { handleServiceError } from '../../common/utils/handle-service-error';

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
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.employeeServiceUrl}/employees`, body, {
          headers: this.getAuthHeader(authorization),
        }),
      );
      return response.data;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async findAll(authorization?: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.employeeServiceUrl}/employees`, {
          headers: this.getAuthHeader(authorization),
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
        this.httpService.get(`${this.employeeServiceUrl}/employees/${id}`, {
          headers: this.getAuthHeader(authorization),
        }),
      );
      return response.data;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async update(id: number, body: any, authorization?: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.employeeServiceUrl}/employees/${id}`,
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

  async deactivate(id: number, authorization?: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.employeeServiceUrl}/employees/${id}/deactivate`,
          {},
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

  async activate(id: number, authorization?: string) {
  try {
    const response = await firstValueFrom(
      this.httpService.patch(
        `${this.employeeServiceUrl}/employees/${id}/activate`,
        {},
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
}