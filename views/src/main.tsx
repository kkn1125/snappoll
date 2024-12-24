import { PROJECT_BASEPATH } from '@common/variables';
import Modal from '@components/moleculars/Modal';
import SocketLayout from '@components/templates/SocketLayout';
import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider,
  alpha,
  createTheme,
  getContrastRatio,
} from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LoadingScreenProvider from '@providers/LoadingScreenProvider';
import ModalProvider from '@providers/ModalProvider';
import AppRoot from '@routes/AppRoot';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'dayjs/locale/ko';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { HelmetProvider } from 'react-helmet-async';
import ThemeModeProvider from '@providers/ThemeModeProvider';

const skyColor = '#98cfff';
const skyColorMain = alpha(skyColor, 0.7);
const skyColorLight = alpha(skyColor, 0.5);
const skyColorDark = alpha(skyColor, 0.9);
const skyColorContrastText =
  getContrastRatio(skyColorMain, '#fff') > 4.5 ? '#fff' : '#111';

// const darkTheme = createTheme({
//   components: {
//     MuiTypography: {
//       defaultProps: {
//         component: 'div',
//         fontWeight: 700,
//       },
//     },
//     MuiButton: {
//       defaultProps: {
//         sx: { fontWeight: 700 },
//       },
//     },
//   },
//   palette: {
//     mode: 'light',
//     sky: {
//       main: skyColorMain,
//       dark: skyColorDark,
//       light: skyColorLight,
//       contrastText: skyColorContrastText,
//     },
//   },
//   typography: {
//     fontFamily: "'Noto Sans KR', 'Nanum', 'Montserrat', 'moneyg', 'Maruburi'",
//   },
// });

const queryClient = new QueryClient();

type DataAttributeKey = `data-${string}`;
declare module 'react' {
  interface HTMLAttribute<T> extends AriaAttributes, DOMAttributes<T> {
    [dataAttribute: DataAttributeKey]: unknown;
  }
}

const helmetContext = {};

createRoot(document.getElementById('root')!).render(
  <ThemeModeProvider>
    <RecoilRoot>
      {/* <AuthProvider> */}
      <SocketLayout>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter
            basename={PROJECT_BASEPATH}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <LoadingScreenProvider>
                <ModalProvider>
                  {/* @ts-ignore */}
                  <HelmetProvider context={helmetContext}>
                    <CssBaseline />
                    <AppRoot />
                    <Modal />
                  </HelmetProvider>
                </ModalProvider>
              </LoadingScreenProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </SocketLayout>
      {/* </AuthProvider> */}
    </RecoilRoot>
  </ThemeModeProvider>,
);
