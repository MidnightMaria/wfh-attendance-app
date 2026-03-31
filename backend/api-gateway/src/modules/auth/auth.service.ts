import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';

  constructor(private readonly httpService: HttpService) {}

  async register(body: any) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/register`, body),
    );
    return response.data;
  }

  async login(body: any) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/login`, body),
    );
    return response.data;
  }

  async getUsers() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.authServiceUrl}/auth/users`),
    );
    return response.data;
  }

  async getProfile(authorization?: string) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const response = await firstValueFrom(
      this.httpService.get(`${this.authServiceUrl}/auth/profile`, {
        headers: {
          Authorization: authorization,
        },
      }),
    );

    return response.data;
  }
}