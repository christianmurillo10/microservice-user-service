import { IHeaders } from "kafkajs";
import KafkaService from "../../services/kafka.service";
import kafkaConfig from "../../config/kafka.config";
import { EVENT_BUSINESS, EVENT_BUSINESS_BULK_DELETED, EVENT_BUSINESS_CREATED, EVENT_BUSINESS_DELETED, EVENT_BUSINESS_UPDATED } from "../../shared/constants/events.constant";
import OrganizationEntity from "../../entities/organization.entity";
import { EventMessageData } from "../../shared/types/common.type";

export default class OrganizationKafkaProducer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafkaClientId,
      brokers: [kafkaConfig.kafkaBroker]
    });
  };

  organizationCreatedEventEmitter = async (data: EventMessageData<OrganizationEntity>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_BUSINESS, EVENT_BUSINESS_CREATED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };

  organizationUpdatedEventEmitter = async (data: EventMessageData<OrganizationEntity>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_BUSINESS, EVENT_BUSINESS_UPDATED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };

  organizationDeletedEventEmitter = async (data: EventMessageData<OrganizationEntity>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_BUSINESS, EVENT_BUSINESS_DELETED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };

  organizationBulkDeletedEventEmitter = async (data: EventMessageData<unknown>, userId: string, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_BUSINESS, EVENT_BUSINESS_BULK_DELETED, data, userId, headers);
    await this.kafkaService.disconnectProducer();
  };
};