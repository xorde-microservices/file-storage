import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { appConfig } from "../../config/app.config";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: (req: Request) => {
				const jwtHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
				return jwtHeader ? jwtHeader : req?.cookies?.jwt;
			},
			ignoreExpiration: false,
			secretOrKey: appConfig().app.jwtSecret,
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub };
	}
}
