import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "../config/env.schema";
import { appConfig } from "../config/app.config";
import { kafkaConfig } from "../config/kafka.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dbConfig } from "../config/db.config";
import { AppService } from "./app.service";
import { FilesModule } from "../modules/files/files.module";
import { swaggerConfig } from "../config/swagger.config";
import { KafkaModule } from "../modules/kafka/kafka.module";
import { AuthModule } from "../modules/auth/auth.module";
import { filesConfig } from "../modules/files/files.config";

@Module({
	imports: [
		TypeOrmModule.forRoot(dbConfig().db),
		ConfigModule.forRoot({
			validationSchema: envSchema,
			isGlobal: true,
			load: [appConfig, kafkaConfig, dbConfig, swaggerConfig, filesConfig],
		}),
		FilesModule,
		// KafkaModule,
		AuthModule,
	],
	providers: [AppService],
})
export class AppModule {}
