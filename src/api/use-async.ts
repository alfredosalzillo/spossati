import { DependencyList, useEffect, useState } from 'react';
import cancellable from 'cancellable';

export type AsyncState<T, Error = any> = {
  value?: T,
  loading: boolean,
  error?: Error,
};
export type AsyncCallback<T> = () => Promise<T>;
const useAsync = <T>(callback: AsyncCallback<T>, deps?: DependencyList): AsyncState<T> => {
  const [state, setState] = useState<AsyncState<any>>({
    loading: false,
  });
  useEffect(() => {
    setState({
      loading: true,
    });
    const onFulfill = cancellable((value: T) => setState({
      value,
      loading: false,
    }));
    const onReject = cancellable((error: any) => setState({
      error,
      loading: false,
    }));
    Promise.resolve(callback())
      .then(onFulfill)
      .catch(onReject);
    return () => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
      onFulfill.cancel();
      onReject.cancel();
    };
  }, deps);
  return state;
};

type MergedAsyncState<T, Errors = any[]> = {
  values: T,
  errors: Errors,
  loading: boolean,
};
export const mergeAsyncStates = <T1, T2>(
  state1: AsyncState<T1>,
  state2: AsyncState<T2>,
): MergedAsyncState<[T1, T2]> => {
  const states = [state1, state2];
  return ({
    loading: states.some(({ loading }) => loading),
    values: states.map(({ value }) => value) as [T1, T2],
    errors: states.map(({ error }) => error) as unknown as [T1, T2],
  });
};

export default useAsync;
