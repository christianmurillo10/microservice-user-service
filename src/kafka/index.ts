import KafkaService from "../services/kafka.service";
import UserKafkaConsumer from "./consumer/user.consumer";
import UserKafkaProducer from "./producer/user.producer";
import kafkaConfig from "../config/kafka.config";
import { EVENT_USER_CREATED, EVENT_USER_UPDATED } from "../shared/constants/events.constant";

export default class KafkaServer {
  run = async () => {
    // Producers
    const userProducer = new UserKafkaProducer();
    await userProducer.execute();

    // Consumers
    const userConsumer = new UserKafkaConsumer();
    await userConsumer.execute();
  };

  disconnect = async () => {
    const kafkaService = new KafkaService({
      clientId: "user-service",
      brokers: [kafkaConfig.kafka_broker]
    });
    await kafkaService.disconnectAdmin();
    await kafkaService.disconnectProducer();
    await kafkaService.disconnectConsumer(EVENT_USER_CREATED);
    await kafkaService.disconnectConsumer(EVENT_USER_UPDATED);
  };
};