import {
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

interface AuthSignLayoutProps {}
const AuthSignLayout: React.FC<AuthSignLayoutProps> = () => {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack flexDirection="row" flex={1}>
      <Stack flex={1} px={2}>
        <Outlet />
      </Stack>
      {!isMdDown && (
        <Fragment>
          <Stack flex={1} />
          <Stack
            position="fixed"
            top={0}
            right={0}
            alignItems="center"
            justifyContent="center"
            gap={4}
            width="50vw"
            height="100vh"
            px={5}
            sx={{
              backgroundColor: (theme) => theme.palette.background.marketing, // 마케팅 배경색 적용

              backdropFilter: 'blur(10px)',
              // backgroundColor: 'rgba(255, 255, 255, 0.5)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              fontSize={56}
              fontWeight={700}
              sx={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundImage: 'linear-gradient(to right, #007BFF, #00C6FF)',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              SnapPoll
            </Typography>
            <Stack alignItems="center" gap={2}>
              <Typography
                fontSize={36}
                fontWeight={600}
                sx={{
                  color: '#007BFF',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
                }}
              >
                쉽고 빠른 설문조사
              </Typography>
              <Typography
                fontSize={20}
                fontWeight={400}
                sx={{
                  color: '#343A40',
                  textAlign: 'center',
                  lineHeight: 1.6,
                  maxWidth: '80%',
                  wordBreak: 'auto-phrase',
                }}
              >
                다양한 설문조사 기능과 빠른 설문 생성을 제공하는 설문조사
                플랫폼입니다.
              </Typography>
            </Stack>
            <Typography
              fontSize={24}
              fontWeight={500}
              sx={{
                color: '#007BFF',
                mt: 2,
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              설문과 투표, 통계까지, 지금 무료로 시작하세요!
            </Typography>
            {/* <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                px: 4,
                py: 1.5,
                fontSize: 18,
                fontWeight: 600,
                borderRadius: 2,
                backgroundImage: 'linear-gradient(to right, #007BFF, #00C6FF)',
              }}
            >
              지금 시작하기
            </Button> */}
          </Stack>
        </Fragment>
      )}
    </Stack>
  );
};

export default AuthSignLayout;
