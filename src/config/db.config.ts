import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";

interface IDbConfig {
	db: TypeOrmModuleOptions;
}

export const dbConfig = (): IDbConfig => {
	return {
		db: {
			dropSchema: false,
			logging: process.env.DB_LOGGING === "true",
			maxQueryExecutionTime: 2000,
			ssl: false,
			synchronize: process.env.DB_MODE === "sync",
			entities: [join(__dirname, "**", "*.entity.ts")],
			autoLoadEntities: true,
			type: "postgres",
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			schema: process.env.DB_SCHEMA,
			database: process.env.DB_NAME,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
		},
	};
};
