import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Headers('authorization') authorization?: string,
  ) {
    return this.employeeService.update(id, body, authorization);
  }

  @Patch(':id/deactivate')
  deactivate(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authorization?: string,
  ) {
    return this.employeeService.deactivate(id, authorization);
  }

  @Patch(':id/activate')
  activate(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authorization?: string,
  ) {
    return this.employeeService.activate(id, authorization);
  }
}