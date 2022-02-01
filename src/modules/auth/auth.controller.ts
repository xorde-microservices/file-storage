import { Controller, Get, Query, Res } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CookieArgs } from "./dto/cookie.dto";
import { Response } from 'express';

@Controller("auth")
@ApiTags("auth")
export class AuthController {
	@ApiOperation({
		summary: "Obtain authorization cookie for supplied JWT",
	})
	@Get("jwt")
	getCookie(@Res({ passthrough: true }) res: Response, @Query() args: CookieArgs) {
		res.cookie("jwt", args.jwt, {
			secure: false,
			httpOnly: true,
			path: "/",
			sameSite: true,
		});
		return {message: "Cookie was set"};
	}
}
