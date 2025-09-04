import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async register(user: CreateUserDto) {
    const existingUser = await this.userService.findByUsername(user.username);
    if (existingUser) {
      throw new ConflictException('Username already in use.');
    }
    try {
      const hashedPassword = await this.hashPassword(user.password);
      this.userService.create({ ...user, password: hashedPassword });
      return {
        message: 'User registered successfully, please login to continue',
      };
    } catch (error) {
      return { error: error };
    }
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new UnauthorizedException('User not found');
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) throw new UnauthorizedException('Wrong Credentials');
    return { id: user.id, role: user.role };
  }

  login(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}
