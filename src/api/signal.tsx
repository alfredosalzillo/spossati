import React, {
  createContext, Dispatch, useCallback, useContext, useReducer,
} from 'react';

type SignalKey = string | number;
type SignalState = {
  [key in SignalKey]: number;
};
type SignalType = 'start' | 'end';
type SignalAction = {
  type: SignalType,
  key: SignalKey,
};
const reducer = (state: SignalState, action: SignalAction) => {
  const { type, key } = action;
  const currentValue = state[key] ?? 0;
  switch (type) {
    case 'start':
      return {
        ...state,
        [key]: currentValue + 1,
      };
    case 'end':
      return {
        ...state,
        [key]: currentValue - 1,
      };
    default:
      return state;
  }
};
const useSignalReducer = () => useReducer(reducer, {});
const SignalContextValue = createContext<SignalState>({});
const SignalContextDispatcher = createContext<Dispatch<SignalAction> | null>(null);

type SignalDispatcher = (type: SignalType) => void;
export const useSignal = (key: SignalKey): [number, SignalDispatcher] => {
  const dispatch = useContext(SignalContextDispatcher)!;
  const value = useContext(SignalContextValue);
  const dispatchSignal = useCallback((type: SignalType) => {
    dispatch({
      type,
      key,
    });
  }, [dispatch, key]);
  return [value[key], dispatchSignal];
};
export const SignalProvider: React.FC = ({
  children,
}) => {
  const [value, dispatch] = useSignalReducer();
  return (
    <SignalContextValue.Provider value={value}>
      <SignalContextDispatcher.Provider value={dispatch}>
        {children}
      </SignalContextDispatcher.Provider>
    </SignalContextValue.Provider>
  );
};
