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
          {state.loading && (
            <Stack
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              justifyContent="center"
              alignItems="center"
              sx={{
                zIndex: 1500,
                backgroundColor: '#ffffffff',
                backdropFilter: 'blur(1px)',
                opacity: state.close ? 0 : 1,
                transition: `opacity ${state.close ? 0.5 : state.timeout}s ease-in-out`,
              }}
            >
              <Typography fontSize={32} fontWeight={700}>
                {state.content}
              </Typography>
            </Stack>
          )}
        </Portal>
        {children}
      </LoadingContext.Provider>
    </LoadingDispatchContext.Provider>
  );
};

export default LoadingScreenProvider;
