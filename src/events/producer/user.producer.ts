import { IHeaders } from "kafkajs";
import KafkaService from "../../services/kafka.service";
import kafkaConfig from "../../config/kafka.config";
import { EVENT_USER, EVENT_USER_BULK_DELETED, EVENT_USER_CREATED, EVENT_USER_DELETED, EVENT_USER_PASSWORD_CHANGED, EVENT_USER_UPDATED } from "../../shared/constants/events.constant";
import UserModel from "../../models/user.model";
import { EventMessageData } from "../../shared/types/common.type";

export default class UserKafkaProducer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafkaClientId,
      brokers: [kafkaConfig.kafkaBroker]
    });
  };

  userCreatedEventEmitter = async (data: EventMessageData<UserModel>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_CREATED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };

  userUpdatedEventEmitter = async (data: EventMessageData<UserModel>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_UPDATED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };

  userDeletedEventEmitter = async (data: EventMessageData<UserModel>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_DELETED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };

  userBulkDeletedEventEmitter = async (data: EventMessageData<unknown>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_BULK_DELETED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };

  userPasswordChangedEventEmitter = async (data: EventMessageData<UserModel>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_USER, EVENT_USER_PASSWORD_CHANGED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };
};