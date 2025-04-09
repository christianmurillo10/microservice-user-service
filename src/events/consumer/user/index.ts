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

    if (message.key.toString() === EVENT_USER_LOGGED_IN) {
      await subscribeUserLoggedIn(message);
    };

    if (message.key.toString() === EVENT_USER_LOGGED_OUT) {
      await subscribeUserLoggedOut(message);
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