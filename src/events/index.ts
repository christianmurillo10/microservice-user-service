import KafkaService from "../services/kafka.service";
import kafkaConfig from "../config/kafka.config";
import KafkaConsumer from "./consumer";
import { EVENT_USER } from "../shared/constants/events.constant";

export default class KafkaServer {
  static listen = async () => {
    const kafkaConsumer = new KafkaConsumer([
      EVENT_USER,
    ]);
    await kafkaConsumer.execute();
  };

  static disconnect = async () => {
    const kafkaService = new KafkaService({
      clientId: kafkaConfig.kafka_client_id,
      brokers: [kafkaConfig.kafka_broker]
    });
    await kafkaService.disconnectProducer();
    await kafkaService.disconnectConsumer(EVENT_USER);
  };
};