import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { appConfig } from "../../config/app.config";
import { AuthController } from "./auth.controller";

@Module({
	imports: [
		PassportModule,
		ConfigModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (): JwtModuleOptions => {
				return { secret: appConfig().app.jwtSecret };
			},
		}),
	],
	providers: [JwtStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
