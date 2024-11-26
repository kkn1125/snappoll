import { createContext } from 'react';
import { LoadingReducerAction, initialValue } from './loadingTypes';

export const LoadingContext = createContext(initialValue);
export const LoadingDispatchContext = createContext(
  (action: LoadingReducerAction) => {},
);
