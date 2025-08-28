import UserEntity from "../../entities/user.entity";
import EventListenerService from "./event-listener.interface";
import EventListenerAbstract from "./event-listener.abstract";

export default class InvalidEventTypeEventListenerService extends EventListenerAbstract<UserEntity> implements EventListenerService<UserEntity> {
  constructor() {
    super();
  };

  execute = async (): Promise<void> => { };
};