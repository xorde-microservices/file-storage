import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { config } from './config/config';
import { ConfigModule } from '@nestjs/config';
import { filesEnvSchema } from './config/schema';

@Module({
	imports: [
		MulterModule.registerAsync({
			useFactory: () => ({ dest: config().files.uploadDir }),
		}),
		ConfigModule.forRoot({
			validationSchema: filesEnvSchema,
			isGlobal: true,
			load: [config],
		}),
	],
	controllers: [FilesController],
	providers: [FilesService],
	exports: [FilesService],
})
export class FilesModule {}
