import KafkaService from "../services/kafka.service";
import UserKafkaConsumer from "./consumer/user";
import UserKafkaProducer from "./producer/user.producer";
import kafkaConfig from "../config/kafka.config";
import { EVENT_USER } from "../shared/constants/events.constant";

export default class KafkaServer {
  static run = async () => {
    // Producers
    const userProducer = new UserKafkaProducer();
    await userProducer.execute();

    // Consumers
    const userConsumer = new UserKafkaConsumer();
    await userConsumer.execute();
  };

  static disconnect = async () => {
    const kafkaService = new KafkaService({
      clientId: kafkaConfig.kafka_client_id,
      brokers: [kafkaConfig.kafka_broker]
    });
    await kafkaService.disconnectAdmin();
    await kafkaService.disconnectProducer();
    await kafkaService.disconnectConsumer(EVENT_USER);
  };
};