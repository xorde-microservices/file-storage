import { defaults } from './config.defaults';

export interface IAppConfigOptions {
	name: string;
	code: string;
	port: number;
	prefix: string;
	cors: string;
}

interface IAppConfig {
	app: IAppConfigOptions;
}

export const appConfig = (): IAppConfig => ({
	app: {
		name: process.env.APP_NAME || defaults.APP_NAME,
		code: process.env.APP_CODE || defaults.APP_CODE,
		port: Number(process.env.APP_PORT) || defaults.APP_PORT,
		prefix: process.env.APP_PREFIX || defaults.APP_PREFIX,
		cors: process.env.APP_CORS,
	},
});
