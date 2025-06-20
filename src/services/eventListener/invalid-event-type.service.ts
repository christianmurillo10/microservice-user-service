import UsersModel from "../../models/users.model";
import EventListenerService from "./event-listener.interface";
import EventListenerAbstract from "./event-listener.abstract";

export default class InvalidEventTypeEventListenerService extends EventListenerAbstract<UsersModel> implements EventListenerService<UsersModel> {
  constructor() {
    super();
  };

  execute = async (): Promise<void> => { };
};