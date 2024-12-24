import { keyframes, Portal, Stack, Typography } from '@mui/material';
import { useEffect, useReducer } from 'react';
import {
  LoadingContext,
  LoadingDispatchContext,
} from './contexts/LoadingContext';
import {
  ActionType,
  initialValue,
  InitialValue,
  LoadingReducerAction,
} from './contexts/loadingTypes';
import LoadingAnimation from '@components/atoms/LoadingAnimationVote';
import LoadingAnimationVote from '@components/atoms/LoadingAnimationVote';
import LoadingAnimationPoll from '@components/atoms/LoadingAnimationPoll';
import LoadingComponent from '@components/atoms/LoadingComponent';

interface LoadingScreenProviderProps {
  children: React.ReactNode;
}
const LoadingScreenProvider: React.FC<LoadingScreenProviderProps> = ({
  children,
}) => {
  const reducer = (state: InitialValue, action: LoadingReducerAction) => {
    switch (action.type) {
      case ActionType.Open: {
        const newState = { ...state };
        newState['loading'] = true;
        if (action.content) newState['content'] = action.content;
        newState['close'] = false;
        if (action.timeout) newState['timeout'] = action.timeout;
        return newState;
      }
      case ActionType.Update: {
        const newState = { ...state };
        newState['close'] = true;
        return newState;
      }
      case ActionType.Close: {
        const newState = { ...state };
        newState['loading'] = false;
        newState['content'] = undefined;
        newState['close'] = undefined;
        newState['timeout'] = 0;
        return newState;
      }
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialValue);
  useEffect(() => {
    let timeout: number | NodeJS.Timeout = 0;
    let closeTimeout: number | NodeJS.Timeout = 0;
    if (state.loading) {
      timeout = setTimeout(() => {
        dispatch({
          type: ActionType.Update,
        });
      }, state.timeout * 1000);
    }
    if (state.close) {
      closeTimeout = setTimeout(() => {
        dispatch({
          type: ActionType.Close,
        });
      }, 500);
    }
    return () => {
      clearTimeout(timeout);
      clearTimeout(closeTimeout);
    };
  }, [state.close, state.loading, state.timeout]);
  return (
    <LoadingDispatchContext.Provider value={dispatch}>
      <LoadingContext.Provider value={state}>
        <Portal>
          <LoadingComponent state={state} />
        </Portal>
        {children}
      </LoadingContext.Provider>
    </LoadingDispatchContext.Provider>
  );
};

export default LoadingScreenProvider;
