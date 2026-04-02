import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

    private async validateEmployee(employee_id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.EMPLOYEE_SERVICE_URL}/employees/internal/${employee_id}`,
        ),
      );

      return response.data;
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 404) {
        throw new BadRequestException('Invalid employee_id');
      }

      throw new BadRequestException('Failed to validate employee_id');
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password, role, employee_id } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.email = email;
    user.password_hash = hashedPassword;
    user.role = role ?? UserRole.EMPLOYEE;

    if (employee_id !== undefined) {
      const employee = await this.validateEmployee(employee_id);

      if (employee.email !== email) {
        throw new BadRequestException(
          'Email must match the employee email registered in employee service',
        );
      }

      user.employee_id = employee_id;
    }

    const savedUser = await this.userRepository.save(user);

    return {
      message: 'User registered successfully',
      data: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        employee_id: savedUser.employee_id,
      },
    };
  }
  
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      employee_id: user.employee_id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employee_id: user.employee_id,
      },
    };
  }
}