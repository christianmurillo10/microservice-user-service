import { EachMessagePayload } from "kafkajs";
import KafkaService from "../../../services/kafka.service";
import kafkaConfig from "../../../config/kafka.config";
import { EVENT_USER, EVENT_USER_LOGGED } from "../../../shared/constants/events.constant";
import subscribeUserLogged from "./user-logged";

export default class UserKafkaConsumer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafka_client_id,
      brokers: [kafkaConfig.kafka_broker]
    });
  };

  private eachMessageHandler = async (payload: EachMessagePayload) => {
    const { message } = payload;

    if (!message.key) {
      return;
    };

    if (message.key.toString() === EVENT_USER_LOGGED) {
      await subscribeUserLogged(message);
    };
  };

  execute = async (): Promise<void> => {
    const topics = [EVENT_USER];
    await this.kafkaService.initializeConsumer(
      topics,
      "user-service-group",
      this.eachMessageHandler
    );
  };
};