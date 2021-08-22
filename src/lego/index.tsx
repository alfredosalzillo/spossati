export type StateReducer<State> = (prevState: State) => {
  [key in keyof State]: (...args: any[]) => Promise<State[key]>
};

export type Dispatcher<State,
  Reducer extends StateReducer<State>> = <K extends keyof ReturnType<Reducer>>(
  key: K,
  ...args: (ReturnType<Reducer>[K] extends (...arg: any[]) => void ?
    Parameters<ReturnType<Reducer>[K]>
    : void[])
) => void;

export const createDispatcher = <State, Reducer extends StateReducer<State>>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reducer: Reducer,
) => null as unknown as Dispatcher<State, Reducer>;
