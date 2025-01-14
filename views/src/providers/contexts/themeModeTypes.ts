import { alpha, getContrastRatio, createTheme } from '@mui/material';

const skyColor = '#98cfff';
const skyColorMain = alpha(skyColor, 0.7);
const skyColorLight = alpha(skyColor, 0.5);
const skyColorDark = alpha(skyColor, 0.9);
const skyColorContrastText =
  getContrastRatio(skyColorMain, '#fff') > 4.5 ? '#fff' : '#111';

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#007BFF', // 메인 블루 색상
      contrastText: '#FFFFFF', // 텍스트 대비 색상
    },
    secondary: {
      main: '#28A745', // 보조 그린 색상
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFC107', // 액션 노란색
      contrastText: '#343A40',
    },
    background: {
      default: '#F8F9FA', // 배경 라이트 그레이
      paper: '#FFFFFF', // 카드 및 컨테이너의 배경
      marketing: '#F0F4FF', // 마케팅 영역의 배경색
    },
    text: {
      primary: '#343A40', // 다크 그레이 텍스트
      secondary: '#6C757D', // 보조 텍스트
    },
    sky: {
      main: skyColorMain,
      dark: skyColorDark,
      light: skyColorLight,
      contrastText: skyColorContrastText,
    },
  },
  typography: {
    fontFamily: "'Noto Sans KR', 'Nanum', 'Montserrat', 'moneyg', 'Maruburi'",
    // h1: {
    //   fontSize: '2.125rem',
    //   fontWeight: 600,
    //   color: '#343A40',
    // },
    // h2: {
    //   fontSize: '1.75rem',
    //   fontWeight: 500,
    //   color: '#343A40',
    // },
    body1: {
      fontSize: '1rem',
      color: '#343A40',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#6C757D',
    },
  },
  components: {
    MuiTypography: { defaultProps: { component: 'div' } },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007BFF', // 메인 블루 색상
      contrastText: '#FFFFFF', // 텍스트 대비 색상
    },
    secondary: {
      main: '#28A745', // 보조 그린 색상
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFC107', // 액션 노란색
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#121212', // 다크모드 배경
      paper: '#1E1E1E', // 카드 및 컨테이너의 배경
      marketing: '#1A1A2E', // 마케팅 영역의 배경색
    },
    text: {
      primary: '#E0E0E0', // 밝은 텍스트 색상
      secondary: '#B0B0B0', // 보조 텍스트
    },
    sky: {
      main: skyColorMain,
      dark: skyColorDark,
      light: skyColorLight,
      contrastText: skyColorContrastText,
    },
  },
  typography: {
    fontFamily: "'Noto Sans KR', 'Nanum', 'Montserrat', 'moneyg', 'Maruburi'",
    h1: {
      fontSize: '2.125rem',
      fontWeight: 600,
      color: '#E0E0E0',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#E0E0E0',
    },
    body1: {
      fontSize: '1rem',
      color: '#E0E0E0',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#B0B0B0',
    },
  },
  components: {
    MuiTypography: { defaultProps: { component: 'div' } },
  },
});

export { lightTheme, darkTheme };
