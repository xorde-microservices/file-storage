export const defaults = {
	APP_NAME: "File storage service",
	APP_CODE: "FSS",
	APP_PORT: 3191,
	API_METHOD_NAME: "api_key",
	/* kafka */
	KAFKA_SSL: false,
	KAFKA_GROUP_ID: "file-storage",
	/* db */
	DB_PORT: 5432,
	DB_SCHEMA: "public",
	DB_LOGGING: false,
	/* swagger */
	SWAGGER_PATH: "/api-docs",
	APP_PREFIX: "/",
};
