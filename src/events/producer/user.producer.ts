import { IHeaders } from "kafkajs";
import KafkaService from "../../services/kafka.service";
import kafkaConfig from "../../config/kafka.config";
import { EVENT_USER, EVENT_USER_CREATED, EVENT_USER_DELETED, EVENT_USER_UPDATED } from "../../shared/constants/events.constant";
import UsersModel from "../../models/users.model";
import { EventMessageData } from "../../shared/types/common.type";

export default class UserKafkaProducer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafka_client_id,
      brokers: [kafkaConfig.kafka_broker]
    });
  };

  publishUserCreated = async (data: EventMessageData<UsersModel>, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_CREATED, data, headers);
    await this.kafkaService.disconnectProducer();
  };

  publishUserUpdated = async (data: EventMessageData<UsersModel>, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_UPDATED, data, headers);
    await this.kafkaService.disconnectProducer();
  };

  publishUserDeleted = async (data: EventMessageData<UsersModel>, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_DELETED, data, headers);
    await this.kafkaService.disconnectProducer();
  };
};