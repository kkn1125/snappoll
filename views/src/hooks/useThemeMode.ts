import { ThemeModeContext } from '@providers/contexts/ThemeModeContext';
import { useCallback, useContext } from 'react';

const useThemeMode = () => {
  const { mode, setMode } = useContext(ThemeModeContext);

  const toggleMode = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  return { mode, toggleMode };
};

export default useThemeMode;
