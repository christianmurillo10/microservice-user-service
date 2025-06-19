import { EventMessageData } from "../../shared/types/common.type";

export default interface EventListenerService<Model> {
  setState(state: EventMessageData<Model | Record<string, string[]>>): void;

  execute(): Promise<void>;
};