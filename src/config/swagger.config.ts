/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/

import { DocumentBuilder, OpenAPIObject } from "@nestjs/swagger";
import { appConfig } from "./app.config";
import { defaults } from "./config.defaults";

export type TSwaggerConfigOptions = Omit<OpenAPIObject, "paths">;

export interface ISwaggerConfigOptions {
	options: TSwaggerConfigOptions;
	path: string;
}

interface ISwaggerConfig {
	swagger: ISwaggerConfigOptions;
}

export const swaggerConfig = (): ISwaggerConfig => ({
	swagger: {
		options: new DocumentBuilder()
			.setTitle(appConfig().app.name + " API")
			.setDescription(defaults.APP_NAME + " API Specification")
			.setVersion("1.0")
			.addBearerAuth()
			.build(),
		path:
			(process.env.SWAGGER_PATH.charAt(0) !== "/" ? "/" : "") +
			process.env.SWAGGER_PATH,
	},
});
