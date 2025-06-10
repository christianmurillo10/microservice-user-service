import { IHeaders } from "kafkajs";
import KafkaService from "../../services/kafka.service";
import kafkaConfig from "../../config/kafka.config";
import { EVENT_ROLE, EVENT_ROLE_BULK_DELETED, EVENT_ROLE_CREATED, EVENT_ROLE_DELETED, EVENT_ROLE_UPDATED } from "../../shared/constants/events.constant";
import RolesModel from "../../models/roles.model";
import { EventMessageData } from "../../shared/types/common.type";

export default class RoleKafkaProducer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafka_client_id,
      brokers: [kafkaConfig.kafka_broker]
    });
  };

  publishRoleCreated = async (data: EventMessageData<RolesModel>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_ROLE, EVENT_ROLE_CREATED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };

  publishRoleUpdated = async (data: EventMessageData<RolesModel>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_ROLE, EVENT_ROLE_UPDATED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };

  publishRoleDeleted = async (data: EventMessageData<RolesModel>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_ROLE, EVENT_ROLE_DELETED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };

  publishRoleBulkDeleted = async (data: EventMessageData<unknown>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_ROLE, EVENT_ROLE_BULK_DELETED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };
};