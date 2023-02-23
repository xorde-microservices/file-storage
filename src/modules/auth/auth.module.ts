import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { authEnvSchema } from './config/schema';
import { authConfig } from './config/config';

@Module({
	imports: [
		PassportModule,
		ConfigModule.forRoot({ validationSchema: authEnvSchema, isGlobal: true, load: [authConfig] }),
		...(authConfig().auth.enable
			? [
					JwtModule.registerAsync({
						inject: [ConfigService],
						useFactory: (): JwtModuleOptions => {
							return { secret: authConfig().auth.jwtSecret };
						},
					}),
			  ]
			: []),
	],
	providers: [JwtStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
