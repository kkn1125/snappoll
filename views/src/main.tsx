import { PROJECT_BASEPATH } from '@common/variables.js';
import Modal from '@components/moleculars/Modal.js';
import SocketLayout from '@components/templates/SocketLayout.js';
import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider,
  alpha,
  createTheme,
  getContrastRatio,
} from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LoadingScreenProvider from '@providers/LoadingScreenProvider.js';
import ModalProvider from '@providers/ModalProvider.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'dayjs/locale/ko';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import AppRouter from './routes/AppRouter.js';

// if (typeof window !== 'undefined') {
//   scan({
//     enabled: import.meta.env.DEV,
//     log: import.meta.env.DEV,
//   });
// }

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

type DataAttributeKey = `data-${string}`;
declare module 'react' {
  interface HTMLAttribute<T> extends AriaAttributes, DOMAttributes<T> {
    [dataAttribute: DataAttributeKey]: unknown;
  }
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={darkTheme}>
    <RecoilRoot>
      <SocketLayout>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter
            basename={PROJECT_BASEPATH}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <LoadingScreenProvider>
                <ModalProvider>
                  <CssBaseline />
                  <AppRouter />
                  <Modal />
                </ModalProvider>
              </LoadingScreenProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </SocketLayout>
    </RecoilRoot>
  </ThemeProvider>,
);
