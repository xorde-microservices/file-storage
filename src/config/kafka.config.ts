import { KafkaOptions, Transport } from "@nestjs/microservices";

export interface ExtendedKafkaOptions {
	topics: string;
	producerTopics: string;
}

export interface IKafkaOptions {
	kafka: KafkaOptions & ExtendedKafkaOptions;
}

export const kafkaConfig = (): IKafkaOptions => ({
	kafka: {
		transport: Transport.KAFKA,
		options: {
			consumer: {
				groupId: process.env.KAFKA_GROUP_ID,
			},
			client: {
				clientId: process.env.KAFKA_CLIENT_ID,
				brokers: process.env.KAFKA_BROKERS.split(","),
				ssl: process.env.KAFKA_SSL === "true",
				sasl: {
					mechanism: "plain",
					username: process.env.KAFKA_USERNAME,
					password: process.env.KAFKA_PASSWORD,
				},
			},
		},
		topics: process.env.KAFKA_TOPICS,
		producerTopics: process.env.KAFKA_PRODUCER_TOPICS,
	},
});
