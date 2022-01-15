import * as Joi from "joi";

export interface IFilesOptions {
	files: {
		uploadDir: string;
	};
}

/* files config */
export const filesConfig = (): IFilesOptions => ({
	files: {
		uploadDir: process.env.FILES_UPLOAD_DIR,
	},
});

/* files schema */
export const filesSchema = {
	FILES_UPLOAD_DIR: Joi.string().required(),
};

/* files standalone env schema */
export const filesEnvSchema = Joi.object({
	...filesSchema,
});
