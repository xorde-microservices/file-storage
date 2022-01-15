import * as Joi from "joi";
import { defaults } from "./config.defaults";
import { filesSchema } from "../modules/files/files.config";

/* Environment variables validation schema */
export const envSchema = Joi.object({
	/* app */
	APP_NAME: Joi.string().allow("").default(defaults.APP_NAME),
	APP_CODE: Joi.string().allow("").default(defaults.APP_CODE),
	APP_PORT: Joi.number().allow("").default(defaults.APP_PORT),
	APP_JWT_SECRET: Joi.string().required(),
	APP_PREFIX: Joi.string().allow("").default(defaults.APP_PREFIX),

	/* kafka */
	KAFKA_TOPICS: Joi.string().allow("").optional(),
	KAFKA_PRODUCER_TOPICS: Joi.string().allow("").optional(),
	KAFKA_SSL: Joi.boolean().allow("").default(defaults.KAFKA_SSL),
	KAFKA_CLIENT_ID: Joi.string().allow(""),
	KAFKA_GROUP_ID: Joi.string().allow("").default(defaults.KAFKA_GROUP_ID),
	KAFKA_USERNAME: Joi.string().allow(""),
	KAFKA_PASSWORD: Joi.string().allow(""),
	KAFKA_BROKERS: Joi.string().required(),

	/* db */
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.number().default(defaults.DB_PORT),
	DB_SCHEMA: Joi.string().default(defaults.DB_SCHEMA),
	DB_NAME: Joi.string().required(),
	DB_USERNAME: Joi.string().required(),
	DB_PASSWORD: Joi.string().required(),
	DB_LOGGING: Joi.boolean().default(defaults.DB_LOGGING),

	/* swagger */
	SWAGGER_PATH: Joi.string().allow("").default(defaults.SWAGGER_PATH),

	/* files */
	...filesSchema,
});
