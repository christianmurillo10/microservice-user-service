import {
  EVENT_USER_LOGGED_IN,
  EVENT_USER_LOGGED_OUT
} from "../../../shared/constants/events.constant";
import InvalidEventTypeEventListenerService from "../invalid-event-type.service";
import UserLoggedInEventListenerService from "./user-logged-in.service";
import UserLoggedOutEventListenerService from "./user-logged-out.service";

export default class UserEventListenerServiceFactory {
  public static createInstance(type: string) {
    switch (type) {
      case EVENT_USER_LOGGED_IN:
        return new UserLoggedInEventListenerService();
      case EVENT_USER_LOGGED_OUT:
        return new UserLoggedOutEventListenerService();
      default:
        return new InvalidEventTypeEventListenerService();
    };
  };
};