import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { MulterModule } from "@nestjs/platform-express";
import { filesConfig, filesEnvSchema } from "./files.config";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		MulterModule.registerAsync({
			useFactory: () => ({ dest: filesConfig().files.uploadDir }),
		}),
		ConfigModule.forRoot({
			validationSchema: filesEnvSchema,
			isGlobal: true,
			load: [filesConfig],
		}),
	],
	controllers: [FilesController],
	providers: [FilesService],
	exports: [FilesService],
})
export class FilesModule {}
