import { EventMessageData } from "../../shared/types/common.type";

export default abstract class EventListenerAbstract<T> {
  state: EventMessageData<T> | undefined;

  setState = (state: EventMessageData<T>) => this.state = state;
};