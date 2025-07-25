import { EachMessagePayload } from "kafkajs";
import KafkaService from "../../services/kafka.service";
import kafkaConfig from "../../config/kafka.config";
import {
  EVENT_USER
} from "../../shared/constants/events.constant";
import userConsumer from "./user.consumer";

export default class KafkaConsumer {
  private kafkaService: KafkaService;
  private topics: string[];

  constructor(topics: string[]) {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafkaClientId,
      brokers: [kafkaConfig.kafkaBroker]
    });
    this.topics = topics;
  };

  private eachMessageHandler = async (payload: EachMessagePayload) => {
    const { topic, message, heartbeat } = payload;

    switch (topic) {
      case EVENT_USER:
        await userConsumer(message);
        break;
    };

    await heartbeat();
  };

  execute = async (): Promise<void> => {
    await this.kafkaService.initializeConsumer(
      this.topics,
      kafkaConfig.kafkaGroupId,
      this.eachMessageHandler
    );
  };
};