export interface IAuthOptions {
	auth: {
		enable: boolean;
		jwtSecret: string;
	};
}

export const authConfig = (): IAuthOptions => ({
	auth: {
		enable: process.env.AUTH_ENABLE === 'true',
		jwtSecret: process.env.AUTH_JWT_SECRET,
	},
});
