import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';

import { Employee } from './entities/employee.entity';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_jwt_secret',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'],
      },
    }),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, JwtStrategy, RolesGuard],
})
export class EmployeeModule {}