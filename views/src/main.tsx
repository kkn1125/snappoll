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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import 'dayjs/locale/ko';

const skyColor = '#98cfff';
const skyColorMain = alpha(skyColor, 0.7);
const skyColorLight = alpha(skyColor, 0.5);
const skyColorDark = alpha(skyColor, 0.9);
const skyColorContrastText =
  getContrastRatio(skyColorMain, '#fff') > 4.5 ? '#fff' : '#111';

const darkTheme = createTheme({
  components: {
    MuiTypography: {
      defaultProps: {
        component: 'div',
      },
    },
  },
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
    fontFamily: "'Montserrat', 'moneyg', 'Maruburi'",
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
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <CssBaseline />
            <AppRouter />
          </LocalizationProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  </ThemeProvider>,
);
