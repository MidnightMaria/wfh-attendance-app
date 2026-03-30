import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  getUsers() {
    return this.authService.findAll();
  }

  @Post('seed')
  seedUser() {
    return this.authService.createDummyUser();
  }
}