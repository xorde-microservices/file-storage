/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-*
 **/

import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app/app.module";
import { kafkaConfig } from "./config/kafka.config";
import { appConfig } from "./config/app.config";
import { toLocalhost } from "./common/log.utils";
import { SwaggerModule } from "@nestjs/swagger";
import { swaggerConfig } from "./config/swagger.config";

const logger = new Logger("Bootstrap");

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger:
			process.env.NODE_ENV === "production"
				? ["log", "warn", "error"]
				: ["log", "debug", "verbose", "warn", "error"],
	});

	app.setGlobalPrefix(appConfig().app.prefix);

	const document = SwaggerModule.createDocument(
		app,
		swaggerConfig().swagger.options,
	);

	SwaggerModule.setup(swaggerConfig().swagger.path, app, document);

	await app.listen(appConfig().app.port);

	logger.log(
		`Swagger: ${
			toLocalhost(await app.getUrl()) + swaggerConfig().swagger.path
		}`,
	);

	logger.log(`App: ${toLocalhost(await app.getUrl())}`);
}

bootstrap().then(() => logger.log("Initialized"));
