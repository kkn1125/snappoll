import { createContext } from 'react';
import { initialValue, ModalReducerAction } from './modalTypes';

export const ModalContext = createContext(initialValue);
export const ModalDispatchContext = createContext(
  (action: ModalReducerAction) => {},
);
