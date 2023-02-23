/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-*
 **/

import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { appConfig } from './app/config/app.config';
import { toLocalhost } from './common/log.utils';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './app/config/swagger.config';
import * as CookieParser from 'cookie-parser';
import * as helmet from 'helmet';

const logger = new Logger('Bootstrap');

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: true,
		logger:
			process.env.NODE_ENV === 'production' ? ['log', 'warn', 'error'] : ['log', 'debug', 'verbose', 'warn', 'error'],
	});

	app.use(CookieParser());
	app.use(helmet.default());
	app.setGlobalPrefix(appConfig().app.prefix);

	app.enableCors({
		origin: true,
		credentials: true,
	});

	const document = SwaggerModule.createDocument(app, swaggerConfig().swagger.options);

	SwaggerModule.setup(swaggerConfig().swagger.path, app, document);

	await app.listen(appConfig().app.port);

	logger.log(`Swagger: ${toLocalhost(await app.getUrl()) + swaggerConfig().swagger.path}`);

	logger.log(`App: ${toLocalhost(await app.getUrl())}`);
}

bootstrap().then(() => logger.log('Initialized'));

/*
 * CORS:
 *
 *  */
