import { IHeaders } from "kafkajs";
import KafkaService from "../../services/kafka.service";
import kafkaConfig from "../../config/kafka.config";
import { EVENT_BUSINESS, EVENT_BUSINESS_CREATED, EVENT_BUSINESS_DELETED, EVENT_BUSINESS_UPDATED } from "../../shared/constants/events.constant";
import BusinessesModel from "../../models/businesses.model";
import { EventMessageData } from "../../shared/types/common.type";

export default class BusinessKafkaProducer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafka_client_id,
      brokers: [kafkaConfig.kafka_broker]
    });
  };

  publishBusinessCreated = async (data: EventMessageData<BusinessesModel>, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_BUSINESS, EVENT_BUSINESS_CREATED, data, headers);
    await this.kafkaService.disconnectProducer();
  };

  publishBusinessUpdated = async (data: EventMessageData<BusinessesModel>, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_BUSINESS, EVENT_BUSINESS_UPDATED, data, headers);
    await this.kafkaService.disconnectProducer();
  };

  publishBusinessDeleted = async (data: EventMessageData<BusinessesModel>, headers?: IHeaders): Promise<void> => {
    await this.kafkaService.connectProducer();
    await this.kafkaService.initializeProducer(EVENT_BUSINESS, EVENT_BUSINESS_DELETED, data, headers);
    await this.kafkaService.disconnectProducer();
  };
};