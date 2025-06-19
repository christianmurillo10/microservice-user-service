import {
  EVENT_USER_BULK_DELETED,
  EVENT_USER_CREATED,
  EVENT_USER_DELETED,
  EVENT_USER_PASSWORD_CHANGED,
  EVENT_USER_UPDATED
} from "../../../shared/constants/events.constant";
import InvalidEventTypeEventListenerService from "../invalid-event-type.service";

export default class UserEventListenerServiceFactory {
  public static createInstance(type: string) {
    switch (type) {
      case EVENT_USER_CREATED:
        return new InvalidEventTypeEventListenerService();
      case EVENT_USER_UPDATED:
        return new InvalidEventTypeEventListenerService();
      case EVENT_USER_DELETED:
        return new InvalidEventTypeEventListenerService();
      case EVENT_USER_BULK_DELETED:
        return new InvalidEventTypeEventListenerService();
      case EVENT_USER_PASSWORD_CHANGED:
        return new InvalidEventTypeEventListenerService();
      default:
        return new InvalidEventTypeEventListenerService();
    };
  };
};