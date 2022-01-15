import { defaults } from "./config.defaults";

export interface IAppConfigOptions {
	name: string;
	code: string;
	port: number;
	jwtSecret: string;
	prefix: string;
}

interface IAppConfig {
	app: IAppConfigOptions;
}

export const appConfig = (): IAppConfig => ({
	app: {
		name: process.env.APP_NAME || defaults.APP_NAME,
		code: process.env.APP_CODE || defaults.APP_CODE,
		port: Number(process.env.APP_PORT) || defaults.APP_PORT,
		jwtSecret: process.env.APP_JWT_SECRET,
		prefix: process.env.APP_PREFIX || defaults.APP_PREFIX,
	},
});
