import { KafkaMessage } from "kafkajs";
import {
  EVENT_USER_LOGGED_IN,
  EVENT_USER_LOGGED_OUT
} from "../../../shared/constants/events.constant";
import subscribeUserLoggedIn from "./user-logged-in.consumer";
import subscribeUserLoggedOut from "./user-logged-out.consumer";

const userConsumer = async (message: KafkaMessage) => {
  const value = JSON.parse(message.value?.toString() ?? '{}');

  if (!value) {
    return;
  };

  switch (value.eventType) {
    case EVENT_USER_LOGGED_IN:
      await subscribeUserLoggedIn(value.data);
      break;
    case EVENT_USER_LOGGED_OUT:
      await subscribeUserLoggedOut(value.data);
      break;
  };
};

export default userConsumer;