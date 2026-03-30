import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev_jwt_secret',
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    role: string;
    employee_id?: number;
  }) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      employee_id: payload.employee_id,
    };
  }
}