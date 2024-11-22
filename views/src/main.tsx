import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider,
  alpha,
  createTheme,
  getContrastRatio,
} from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import AppRouter from './routes/AppRouter.js';
import { PROJECT_BASEPATH } from '@common/variables.js';

const skyColor = '#98cfff';
const skyColorMain = alpha(skyColor, 0.7);
const skyColorLight = alpha(skyColor, 0.5);
const skyColorDark = alpha(skyColor, 0.9);
const skyColorContrastText =
  getContrastRatio(skyColorMain, '#fff') > 4.5 ? '#fff' : '#111';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
    sky: {
      main: skyColorMain,
      dark: skyColorDark,
      light: skyColorLight,
      contrastText: skyColorContrastText,
    },
  },
  typography: {
    fontFamily: "'Montserrat', 'Maruburi'",
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={darkTheme}>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter
          basename={PROJECT_BASEPATH}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <CssBaseline />
          <AppRouter />
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  </ThemeProvider>,
);
