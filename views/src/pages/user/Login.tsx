import { login } from '@/apis/login';
import { tokenAtom } from '@/recoils/token.atom';
import useModal from '@hooks/useModal';
import {
  Container,
  Stack,
  Portal,
  Paper,
  Typography,
  Button,
  TextField,
  Divider,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

interface LoginProps {}
const Login: React.FC<LoginProps> = () => {
  const { openModal } = useModal();
  const locate = useLocation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<Message<LoginUser>>>({});
  const [loginInfo, setLoginInfo] = useState<LoginUser>({
    email: '',
    password: '',
  });
  const setToken = useSetRecoilState(tokenAtom);
  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess(data, variables, context) {
      if (data.ok) {
        setLoginInfo(() => ({
          email: '',
          password: '',
        }));
        setToken((token) => ({
          token: data.token,
          signed: !!data.token,
          expired: false,
        }));
        navigate('/');
      }
    },
    onError(error: AxiosError, variables, context) {
      const { response } = error;
      const { data } = response as { data: any };

      openModal({
        title: '잘못된 요청',
        content: data.message,
      });
    },
  });

  useEffect(() => {
    window.history.replaceState({}, '');
    if (locate?.state?.type) {
      openModal({
        title: '권한 필요',
        content: '로그인이 필요한 기능입니다.',
      });
    }
  }, [locate?.state?.type, openModal]);

  function validateForm() {
    const errors: Partial<Message<LoginUser>> = {};
    if (loginInfo.email === '') {
      errors['email'] = '필수입니다.';
    }
    if (loginInfo.password === '') {
      errors['password'] = '필수입니다.';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    mutation.mutate(loginInfo);

    return false;
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setLoginInfo((loginInfo) => ({ ...loginInfo, [name]: value }));
  }

  return (
    <Container component={Stack} maxWidth="sm" gap={2}>
      <Stack component="form" gap={2} onSubmit={handleSubmit} noValidate>
        <Typography fontSize={32} fontWeight={700} align="center">
          로그인
        </Typography>
        <TextField
          variant="filled"
          label="Email"
          name="email"
          type="email"
          value={loginInfo.email}
          autoComplete="username"
          onChange={onChange}
          required
          error={!!errors['email']}
          helperText={errors['email']}
        />

        <TextField
          variant="filled"
          label="Password"
          name="password"
          type="password"
          value={loginInfo.password}
          autoComplete="current-password"
          onChange={onChange}
          required
          error={!!errors['password']}
          helperText={errors['password']}
        />

        <Divider />
        <Button variant="contained" size="large" type="submit">
          로그인
        </Button>
        <Button
          component={Link}
          variant="contained"
          size="large"
          to="/user/signup"
          color="warning"
        >
          계정이 없어요
        </Button>
        <Button
          component={Link}
          variant="contained"
          size="large"
          to="/"
          color="inherit"
        >
          메인으로
        </Button>
      </Stack>
    </Container>
  );
};

export default Login;
