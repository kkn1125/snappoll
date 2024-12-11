import { requestKakaoLogin } from '@/apis/requestKakaoLogin';
import { Kakao } from '@common/variables';
import useToken from '@hooks/useToken';
import { Button, Container, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

interface ChoiceProps {}
const Choice: React.FC<ChoiceProps> = () => {
  // const locate = useLocation();
  const { loginToken } = useToken();
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
      loginToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  return (
    <Container
      maxWidth="xs"
      sx={{
        flex: 1,
        height: 'inherit',
      }}
    >
      <Stack gap={2}>
        <Typography fontSize={24} fontWeight={700} align="center">
          쉽고 빠르게!
        </Typography>
        <Typography fontSize={24} fontWeight={700} align="center">
          간편하게 로그인하세요.
        </Typography>
        <Typography align="center" mb={5}>
          간편한 설문조사, 스냅폴
        </Typography>

        <Button
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
        </Button>

        <Button
          component={Link}
          variant="outlined"
          color="inherit"
          size="large"
          to="/user/login"
        >
          SnapPoll 계정으로 계속하기
        </Button>

        <Button
          component={Link}
          variant="outlined"
          color="inherit"
          size="large"
          to="/user/signup"
        >
          SnapPoll 회원가입
        </Button>
      </Stack>
    </Container>
  );
};

export default Choice;
