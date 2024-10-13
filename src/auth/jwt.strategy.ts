import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '/1RCBoMJ3A/CjuNozR0dfGJOsmicbNtiDKp23hzeHA8=', 
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}