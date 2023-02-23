import * as Joi from 'joi';
import { defaults } from './config.defaults';

/* Environment variables validation schema */
export const envSchema = Joi.object({
	/* app */
	APP_NAME: Joi.string().allow('').default(defaults.APP_NAME),
	APP_PREFIX: Joi.string().allow('').default(defaults.APP_PREFIX),

	/* swagger */
	APP_SWAGGER_PATH: Joi.string().allow('').default(defaults.APP_SWAGGER_PATH),
});
