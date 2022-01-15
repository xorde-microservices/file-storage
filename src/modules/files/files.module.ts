import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { MulterModule } from "@nestjs/platform-express";
import { filesConfig } from "./files.config";

@Module({
	imports: [
		// TODO: move directory to settings
		MulterModule.registerAsync({
			useFactory: () => ({ dest: filesConfig().files.uploadDir }),
		}),
	],
	controllers: [FilesController],
	providers: [FilesService],
	exports: [FilesService],
})
export class FilesModule {}
