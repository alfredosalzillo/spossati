import { useHistory, useLocation } from 'react-router-dom';
import {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';

const useLocationState = <S>(
  key: string,
  initialState?: S | (() => S),
): [S, Dispatch<SetStateAction<S>>] => {
  const location = useLocation<any>();
  const history = useHistory();
  const currentValue: S = location.state?.[key];
  const [state, setState] = useState<S>(currentValue ?? initialState);
  useEffect(() => {
    history.replace({
      ...location,
      state: {
        ...(location.state || {}),
        [key]: state && JSON.parse(JSON.stringify(state)),
      },
    });
  }, [state]);
  return [state, setState];
};

export default useLocationState;
