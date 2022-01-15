import * as Joi from "joi";

export interface IFilesOptions {
	files: {
		uploadDir: string;
	};
}

export const filesConfig = (): IFilesOptions => ({
	files: {
		uploadDir: process.env.FILES_UPLOAD_DIR,
	},
});

export const filesSchema = {
	FILES_UPLOAD_DIR: Joi.string().required(),
};
