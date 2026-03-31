import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const existingEmployeeCode = await this.employeeRepository.findOne({
      where: { employee_code: createEmployeeDto.employee_code },
    });

    if (existingEmployeeCode) {
      throw new BadRequestException('Employee code already exists');
    }

    const existingEmail = await this.employeeRepository.findOne({
      where: { email: createEmployeeDto.email },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      is_active: createEmployeeDto.is_active ?? true,
    });

    return this.employeeRepository.save(employee);
  }

  async findAll() {
    return this.employeeRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (
      updateEmployeeDto.employee_code &&
      updateEmployeeDto.employee_code !== employee.employee_code
    ) {
      const existingEmployeeCode = await this.employeeRepository.findOne({
        where: { employee_code: updateEmployeeDto.employee_code },
      });

      if (existingEmployeeCode) {
        throw new BadRequestException('Employee code already exists');
      }
    }

    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const existingEmail = await this.employeeRepository.findOne({
        where: { email: updateEmployeeDto.email },
      });

      if (existingEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    Object.assign(employee, updateEmployeeDto);

    return this.employeeRepository.save(employee);
  }

  async deactivate(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    employee.is_active = false;

    return this.employeeRepository.save(employee);
  }
}