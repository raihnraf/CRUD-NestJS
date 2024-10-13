import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('LocalStrategy validating:', email);
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      console.log('LocalStrategy: User not found or invalid password');
      throw new UnauthorizedException();
    }
    console.log('LocalStrategy: User validated successfully');
    return user;
  }
}