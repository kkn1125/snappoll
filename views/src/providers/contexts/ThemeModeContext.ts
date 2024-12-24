import { createContext } from 'react';

export const initializeValue = {
  mode: 'light',
  setMode: (mode: 'light' | 'dark') => {},
};
export const ThemeModeContext = createContext(initializeValue);
