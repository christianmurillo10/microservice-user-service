import KafkaService from "../../services/kafka.service";
import kafkaConfig from "../../config/kafka.config";
import { EVENT_USER, EVENT_USER_CREATED, EVENT_USER_UPDATED } from "../../shared/constants/events.constant";
import UsersModel from "../../models/users.model";

export default class UserKafkaProducer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafka_client_id,
      brokers: [kafkaConfig.kafka_broker]
    });
  };

  publishUserCreated = async (data: UsersModel): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_CREATED, data);
    await this.kafkaService.disconnectProducer();
  };

  publishUserUpdated = async (data: UsersModel): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_UPDATED, data);
    await this.kafkaService.disconnectProducer();
  };
};