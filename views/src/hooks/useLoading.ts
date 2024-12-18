import {
  LoadingContext,
  LoadingDispatchContext,
} from '@providers/contexts/LoadingContext';
import { ActionType } from '@providers/contexts/loadingTypes';
import { useCallback, useContext } from 'react';

const useLoading = () => {
  const loadingState = useContext(LoadingContext);
  const loadingDispatch = useContext(LoadingDispatchContext);
  const openLoading = useCallback(
    (content: string, timeout: number = 2) => {
      loadingDispatch({ type: ActionType.Open, content, timeout });
    },
    [loadingDispatch],
  );
  const updateLoading = useCallback(() => {
    loadingDispatch({ type: ActionType.Update });
  }, [loadingDispatch]);
  const closeLoading = useCallback(() => {
    loadingDispatch({ type: ActionType.Close });
  }, [loadingDispatch]);

  return {
    loadingState,
    openLoading,
    updateLoading,
    closeLoading,
  };
};

export default useLoading;
