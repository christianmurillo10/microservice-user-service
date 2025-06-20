import { EventMessageData } from "../../shared/types/common.type";

export default interface EventListenerService<T> {
  setState(state: EventMessageData<T>): void;

  execute(): Promise<void>;
};