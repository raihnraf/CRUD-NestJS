import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    this.logger.debug(`Validating user: ${email}`);
    const user = await this.usersService.findOne(email);
    
    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug(`User ${email} validated successfully`);
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    this.logger.debug(`Logging in user: ${user.email}`);
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    this.logger.debug('JWT token generated successfully');
    return {
      access_token: token,
    };
  }

  async register(user: any) {
    this.logger.debug(`Registering new user: ${user.email}`);
    return this.usersService.create({
      email: user.email,
      password: user.password,
    });
  }
}
