import UsersModel from "../../models/users.model";
import { EventMessageData } from "../../shared/types/common.type";
import EventListenerService from "./event-listener.interface";
import EventListenerAbstract from "./event-listener.abstract";

export default class InvalidEventTypeEventListenerService extends EventListenerAbstract<EventMessageData<UsersModel>> implements EventListenerService<UsersModel> {
  constructor() {
    super();
  };

  execute = async (): Promise<void> => { };
};