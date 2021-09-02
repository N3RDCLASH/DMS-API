import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Request } from '@nestjs/common';
import { RequestInjectable } from 'src/injectables/request.injectable';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(RequestInjectable) private requestInjectable: RequestInjectable,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    this.requestInjectable.setUser(payload.user);
    return { ...payload.user };
  }
}
