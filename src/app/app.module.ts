import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.schema';
import { appConfig } from './config/app.config';
import { AppService } from './app.service';
import { FilesModule } from '../modules/files/files.module';
import { swaggerConfig } from './config/swagger.config';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: envSchema,
			isGlobal: true,
			load: [appConfig, swaggerConfig],
		}),
		FilesModule,
		AuthModule,
	],
	providers: [AppService],
})
export class AppModule {}
