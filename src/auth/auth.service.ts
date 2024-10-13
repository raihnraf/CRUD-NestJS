import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    console.log('Validating user:', email);
    const user = await this.usersService.findOne(email);
    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('Stored hashed password:', user.password);
      console.log('Provided password:', pass);
      const isPasswordValid = await bcrypt.compare(pass, user.password);
      console.log('Password valid:', isPasswordValid);
      if (isPasswordValid) {
        console.log('Password matched');
        const { password, ...result } = user;
        return result;
      }
    }
    console.log('Authentication failed');
    return null;
  }

  async login(user: any) {
    console.log('Logging in user:', user.email);
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    console.log('JWT token generated successfully');
    return {
      access_token: token,
    };
  }

  async register(user: any) {
    console.log('Registering user with password:', user.password);
    return this.usersService.create({
      email: user.email,
      password: user.password, // Pass the plain password
    });
  }
}