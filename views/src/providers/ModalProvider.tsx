import { useMemo, useReducer } from 'react';
import { ModalContext, ModalDispatchContext } from './contexts/ModalContext';
import {
  initialValue,
  ModalActionType,
  ModalInitialValue,
  ModalReducerAction,
} from './contexts/modalTypes';

const reducer = (state: ModalInitialValue, action: ModalReducerAction) => {
  switch (action.type) {
    case ModalActionType.Open: {
      const newState = { ...state };
      newState['open'] = true;
      if (action.title) newState['title'] = action.title;
      if (action.content) newState['content'] = action.content;
      if (action.slot !== undefined) newState['slot'] = action.slot;
      if (action.closeCallback)
        newState['closeCallback'] = action.closeCallback;
      return newState;
    }
    case ModalActionType.OpenInteractive: {
      const newState = { ...state };
      newState['interactive'] = true;
      newState['open'] = true;
      if (action.title) newState['title'] = action.title;
      if (action.content) newState['content'] = action.content;
      if (action.slot !== undefined) newState['slot'] = action.slot;
      if (action.callback) newState['callback'] = action.callback;
      if (action.closeCallback)
        newState['closeCallback'] = action.closeCallback;
      return newState;
    }
    case ModalActionType.Close: {
      const newState = { ...state };
      newState['open'] = false;
      newState['title'] = '';
      newState['content'] = [];
      newState['slot'] = undefined;
      newState['callback'] = () => {};
      newState['closeCallback'] = () => {};
      newState['interactive'] = false;
      return newState;
    }
    default:
      return state;
  }
};

interface ModalProviderProps {
  children: React.ReactNode;
}
const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValue);

  const { state: memoState, dispatch: memoDispatch } = useMemo(
    () => ({ state, dispatch }),
    [state],
  );

  return (
    <ModalDispatchContext.Provider value={memoDispatch}>
      <ModalContext.Provider value={memoState}>
        {children}
      </ModalContext.Provider>
    </ModalDispatchContext.Provider>
  );
};

export default ModalProvider;
