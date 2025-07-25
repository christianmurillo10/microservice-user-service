import UserModel from "../../models/user.model";
import EventListenerService from "./event-listener.interface";
import EventListenerAbstract from "./event-listener.abstract";

export default class InvalidEventTypeEventListenerService extends EventListenerAbstract<UserModel> implements EventListenerService<UserModel> {
  constructor() {
    super();
  };

  execute = async (): Promise<void> => { };
};