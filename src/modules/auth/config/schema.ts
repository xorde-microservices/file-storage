import * as Joi from 'joi';
import { authDefaults } from './defaults';

export const authConfigSchema = {
	AUTH_ENABLE: Joi.string().default(authDefaults.enable),
	AUTH_JWT_SECRET: Joi.string().when('AUTH_ENABLE', { is: true, then: Joi.required() }),
};

export const authEnvSchema = Joi.object(authConfigSchema);
