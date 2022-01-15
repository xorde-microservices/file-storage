import { IHeaders } from "kafkajs";

export interface KafkaTopic {
	name: string;
	subchannel?: string;
	userchannel?: string;
}

export type KafkaTopics = KafkaTopic[];

export interface MessagePayload {
	topic: string;
	partition: number;
	message: KafkaMessageExt;
	userchannel?: string;
	subchannel?: string;
}

export type KafkaMessageExt = {
	key?: any;
	value: any;
	timestamp?: string;
	size?: number;
	attributes?: number;
	offset?: string;
	headers?: IHeaders;
};
