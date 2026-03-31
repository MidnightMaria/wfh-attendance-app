import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [HttpModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}