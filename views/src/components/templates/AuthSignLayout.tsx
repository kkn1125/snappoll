import {
  Box,
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
      <Stack flex={1}>
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
            gap={2}
            width="50vw"
            height="100vh"
            px={5}
            sx={{ background: '#121212' }}
          >
            <Typography
              fontSize={52}
              fontWeight={700}
              sx={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundImage: 'linear-gradient(to right, #98cfff, #007bff)',
              }}
            >
              SnapPoll
            </Typography>
            <Stack alignItems="center">
              <Typography fontSize={34} fontWeight={500} sx={{ mt: 1 }}>
                쉽고 빠른 설문조사
              </Typography>
              <Typography fontSize={20} fontWeight={500} sx={{ mt: 1 }}>
                다양한 설문조사 기능과 빠른 설문 생성을 제공하는 설문조사
                플랫폼입니다.
              </Typography>
            </Stack>
            <Typography fontSize={24} fontWeight={500} sx={{ mt: 1 }}>
              설문과 투표, 통계까지, 지금 무료로 시작하세요!
            </Typography>
          </Stack>
        </Fragment>
      )}
    </Stack>
  );
};

export default AuthSignLayout;
