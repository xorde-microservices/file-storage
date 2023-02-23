import * as Joi from 'joi';

/* files schema */
export const filesSchema = {
	FILES_UPLOAD_DIR: Joi.string().required(),
};

/* files standalone env schema */
export const filesEnvSchema = Joi.object({
	...filesSchema,
});
