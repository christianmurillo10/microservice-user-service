export default abstract class EventListenerAbstract<State> {
  state: State | undefined;

  setState = (state: State) => this.state = state;
};