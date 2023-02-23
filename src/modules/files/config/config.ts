export interface IFilesOptions {
	files: {
		uploadDir: string;
	};
}

/* files config */
export const config = (): IFilesOptions => ({
	files: {
		uploadDir: process.env.FILES_UPLOAD_DIR,
	},
});
