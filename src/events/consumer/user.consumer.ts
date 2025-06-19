import { KafkaMessage } from "kafkajs";
import UserEventListenerServiceFactory from "../../services/eventListener/user/user-factory.service";

const userConsumer = async (message: KafkaMessage) => {
  const value = JSON.parse(message.value?.toString() ?? '{}');

  if (!value) {
    return;
  };

  const instance = UserEventListenerServiceFactory.createInstance(value.eventType);
  instance.setState(value.data);
  await instance.execute();
};

export default userConsumer;