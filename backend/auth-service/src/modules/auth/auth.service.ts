import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find();
  }

  async createDummyUser() {
    const user = this.userRepository.create({
      email: 'test@email.com',
      password_hash: '123456',
      role: UserRole.EMPLOYEE,
    });

    return this.userRepository.save(user);
  }
}