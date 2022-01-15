import { Injectable } from "@nestjs/common";
import { Consumer, Kafka, Producer, ProducerRecord } from "kafkajs";
import {
	KafkaMessageExt,
	KafkaTopics,
	MessagePayload,
} from "./kafka.interface";
import * as R from "rambda";
import { EventService } from "../../common/event.service";
import { kafkaConfig } from "../../config/kafka.config";
import { j, v } from "../../common/log.utils";
import { isValidRegex, stringToRegex } from "../../common/regex.utils";
import { appConfig } from "../../config/app.config";

@Injectable()
export class KafkaService extends EventService {
	private readonly config = kafkaConfig().kafka;
	private readonly topics: KafkaTopics = this.parseTopics(
		kafkaConfig().kafka.topics,
	);
	private kafka: Kafka;
	private consumer: Consumer;
	private producer: Producer;

	KafkaLogCreator = (logLevel) => {
		return ({ namespace, level, label, log }) => {
			const { message, ...others } = log;
			switch (level) {
				case logLevel.ERROR:
					this.logger.error(
						`${label} [Kafka:${namespace}] ${message} ${j(others)}`,
					);
					break;
				default:
					this.logger.log(
						`${label} [Kafka:${namespace}] ${message} ${j(others)}`,
					);
			}
		};
	};

	/* Modification of standard emitter to allow user to subscribe to all events emitted by subscribing to "*" */
	emit(type, ...args) {
		super.emit("*", ...args);
		return super.emit(type, ...args) || super.emit("", ...args);
	}

	/* Returns configured Kafka topics */
	getTopics(): KafkaTopics {
		return this.topics;
	}

	/*
	 * Parse topic string into array of KafkaTopic
	 * accepts topics string in format:
	 * topic1[user=user,subchannel=test];topic2[subchannel=test]
	 * Reference: https://regex101.com/r/jpEKVk/1
	 */
	parseTopics(topics: string): KafkaTopics {
		const re = /(?<key>[^=\[,]+)=(?<value>[^,\]]+)/g;
		const topicElements = (topics || "").split(";").filter((f) => f.length > 0);
		return topicElements.map((element) => {
			const params = [...element.matchAll(re)];
			const topic = {
				name: element.split("[")[0],
				subchannel: params.filter((f) => f[1] == "subchannel")[0]?.[2],
				userchannel: params.filter((f) => f[1] == "user")[0]?.[2],
			};
			Object.keys(topic).forEach((key) =>
				topic[key] === undefined ? delete topic[key] : {},
			);
			return topic;
		});
	}

	constructor() {
		super();
		this.logger.log("Topics: " + v(this.topics));

		this.kafka = new Kafka({
			logCreator: this.KafkaLogCreator,
			...this.config.options.client,
		});

		this.consumer = this.kafka.consumer({
			...this.config.options.consumer,
		});

		this.producer = this.kafka.producer();
	}

	async onModuleInit() {
		try {
			await this.producer.connect();
		} catch (e) {
			this.logger.error(e);
		}

		try {
			await this.consumer.connect();
			if (this.consumer) {
				for (const topic of this.topics) {
					const name = isValidRegex(topic.name)
						? stringToRegex(topic.name)
						: topic.name;
					await this.consumer.subscribe({
						topic: name,
					});
				}
				await this.consumer.run({
					eachMessage: async (payload: MessagePayload) =>
						this.handleMessage(payload),
				});
			}
		} catch (e) {
			this.logger.error(e);
		}
	}

	handleMessage(payload: MessagePayload) {
		const topic = this.topics.find((f) => f.name == payload.topic);

		// convert value buffer type to object type or string type:
		try {
			payload.message.value = JSON.parse(payload.message.value.toString());
		} catch (e) {
			payload.message.value = payload.message.value
				? payload.message.value.toString()
				: null;
		}

		// convert key buffer type to object type or string type:
		try {
			payload.message.key = JSON.parse(payload.message.key.toString());
		} catch (e) {
			payload.message.key = payload.message.key
				? payload.message.key.toString()
				: null;
		}

		// if subchannel is configured
		if (topic.subchannel) {
			payload.subchannel = payload.message.value[topic.subchannel];
		}

		// if userchannel is configured
		if (topic.userchannel) {
			payload.userchannel = payload.message.value[topic.userchannel];
		}

		this.logger.verbose(
			"Message: " + v(R.pick(["topic", "key", "timestamp"], payload)),
		);

		try {
			this.emit(payload.topic.toString(), payload);
		} catch (e) {
			this.logger.error("Emit failed " + e);
		}
	}

	/* Send a message to Kafka topic */
	async send(topic: string, message: KafkaMessageExt) {
		message.key = message.key ? Buffer.from(JSON.stringify(message.key)) : null;
		message.value = Buffer.from(JSON.stringify(message.value));
		message.headers = { ...message.headers, src: appConfig().app.code };

		const record: ProducerRecord = {
			topic,
			messages: [message],
		};
		await this.producer.send(record);
		return message;
	}
}
