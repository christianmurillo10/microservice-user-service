import { EachMessagePayload } from "kafkajs";
import KafkaService from "../../services/kafka.service";
import config from "../../config/kafka.config";
import { EVENT_USER_CREATED, EVENT_USER_UPDATED } from "../../shared/constants/events.constant";

export default class UserKafkaConsumer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: "user-service",
      brokers: [config.kafka_broker]
    });
  };

  private eachMessageHandler = async (payload: EachMessagePayload) => {
    const { topic, partition, message } = payload;
    console.log({
      topic,
      partition,
      key: message.key?.toString(),
      value: message.value?.toString(),
    });
  };

  execute = async (): Promise<void> => {
    const topics = [
      EVENT_USER_CREATED,
      EVENT_USER_UPDATED
    ];

    await this.kafkaService.initializeConsumer(
      topics,
      "user-service-group",
      this.eachMessageHandler
    );
  };
};