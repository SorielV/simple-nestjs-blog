import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ISession } from '../common/interface';
import { JWTConfig } from 'src/config/config';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super(<StrategyOptions>{
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.headers.authorization?.substring(7),
      ]),
      secretOrKey: configService.get<JWTConfig>('jwt').secret,
    });
  }

  async validate(session: ISession): Promise<ISession> {
    return session;
  }
}
