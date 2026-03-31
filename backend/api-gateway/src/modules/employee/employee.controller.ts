import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(
    @Body() body: any,
    @Headers('authorization') authorization?: string,
  ) {
    return this.employeeService.create(body, authorization);
  }

  @Get()
  findAll(@Headers('authorization') authorization?: string) {
    return this.employeeService.findAll(authorization);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authorization?: string,
  ) {
    return this.employeeService.findOne(id, authorization);
  }
}