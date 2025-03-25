import KafkaService from "../../services/kafka.service";
import kafkaConfig from "../../config/kafka.config";
import { EVENT_USER_CREATED, EVENT_USER_UPDATED } from "../../shared/constants/events.constant";
import Users from "../../shared/entities/users.entity";

export default class UserKafkaProducer {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService({
      clientId: kafkaConfig.kafka_client_id,
      brokers: [kafkaConfig.kafka_broker]
    });
  };

  publishUserCreated = async (data: Users): Promise<void> => {
    await this.kafkaService.connectProducer()
    await this.kafkaService.initializeProducer(EVENT_USER_CREATED, data);
  };

  publishUserUpdated = async (data: Users): Promise<void> => {
    await this.kafkaService.connectProducer()
    await this.kafkaService.initializeProducer(EVENT_USER_UPDATED, data);
  };

  execute = async (): Promise<void> => {
    await this.kafkaService.connectAdmin();
    await this.kafkaService.createTopics([
      {
        topic: EVENT_USER_CREATED,
        numPartitions: 2,
        replicationFactor: 1
      },
      {
        topic: EVENT_USER_UPDATED,
        numPartitions: 2,
        replicationFactor: 1
      }
    ]);
    await this.kafkaService.connectProducer();
  };
};