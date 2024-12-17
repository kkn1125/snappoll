import { requestKakaoLogin } from '@/apis/requestKakaoLogin';
import { Button, Container, Divider, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Logger } from '@utils/Logger';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const logger = new Logger('AuthPage');

interface AuthPageProps {}
const AuthPage: React.FC<AuthPageProps> = () => {
  const [param] = useSearchParams();
  const kakaoLoginMutation = useMutation({
    mutationKey: ['kakaoLogin'],
    mutationFn: requestKakaoLogin,
  });

  function handleRedirectKakaoLogin() {
    kakaoLoginMutation.mutate();
  }

  useEffect(() => {
    const accessToken = param.get('access_token');
    const refreshToken = param.get('refresh_token');
    const idToken = param.get('id_token');
    if (accessToken && refreshToken && idToken) {
      logger.debug('소셜 로그인');
    }
  }, [param]);

  return (
    <Stack gap={5} justifyContent="center" flex={1}>
      <Container maxWidth="xs">
        <Stack gap={4}>
          <Stack>
            <Typography fontSize={30} fontWeight={700} align="center">
              간편하게 로그인하세요.
            </Typography>
            <Typography
              fontSize={30}
              fontWeight={700}
              align="center"
            ></Typography>
            <Typography
              fontSize={20}
              align="center"
              fontWeight={700}
              color="textDisabled"
            >
              간편한 설문조사, 스냅폴
            </Typography>
          </Stack>
          <Stack gap={1}>
            {/* <Button
          variant="contained"
          color="inherit"
          size="large"
          startIcon={<Kakao />}
          sx={{
            backgroundColor: '#FEE500',
            display: 'flex',
            alignItems: 'center',
            color: 'rgba(0, 0, 0, 0.85)',
          }}
          onClick={handleRedirectKakaoLogin}
        >
          카카오 계정으로 계속하기
        </Button> */}

            <Button
              component={Link}
              variant="outlined"
              color="inherit"
              size="large"
              to="/auth/login"
              sx={{ fontSize: 18, fontWeight: 700 }}
            >
              이메일로 계속하기
            </Button>

            <Button
              component={Link}
              variant="outlined"
              color="inherit"
              size="large"
              to="/auth/signup"
              sx={{ fontSize: 18, fontWeight: 700 }}
            >
              SnapPoll 회원가입
            </Button>
          </Stack>
          <Stack direction="row" justifyContent="center" gap={1}>
            <Typography
              component={Link}
              to="/auth/account"
              color="textSecondary"
              sx={{ textDecoration: 'none' }}
            >
              계정 찾기
            </Typography>
            <Divider flexItem orientation="vertical" />
            <Typography
              component={Link}
              to="/"
              color="textSecondary"
              sx={{ textDecoration: 'none' }}
            >
              메인으로
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default AuthPage;
