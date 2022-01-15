import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { appConfig } from "../../config/app.config";
import { v } from "../../common/log.utils";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: appConfig().app.jwtSecret,
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub };
	}
}
