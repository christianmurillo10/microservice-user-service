import { EachMessagePayload } from "kafkajs";
import KafkaService from "../../../services/kafka.service";
import kafkaConfig from "../../../config/kafka.config";
import { EVENT_USER, EVENT_USER_LOGGED_IN, EVENT_USER_LOGGED_OUT } from "../../../shared/constants/events.constant";
import subscribeUserLoggedIn from "./user-logged-in.consumer";
import subscribeUserLoggedOut from "./user-logged-out.consumer";

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

    switch (message.key.toString()) {
      case EVENT_USER_LOGGED_IN:
        await subscribeUserLoggedIn(message);
        break;
      case EVENT_USER_LOGGED_OUT:
        await subscribeUserLoggedOut(message);
        break;
    };
  };

  execute = async (): Promise<void> => {
    await this.kafkaService.initializeConsumer(
      EVENT_USER,
      "user-service-group",
      this.eachMessageHandler
    );
  };
};