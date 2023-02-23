import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { authConfig } from './config/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: (req: Request) => {
				const jwtHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
				return jwtHeader ? jwtHeader : req?.cookies?.jwt;
			},
			ignoreExpiration: false,
			secretOrKey: authConfig().auth.jwtSecret,
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub };
	}
}
