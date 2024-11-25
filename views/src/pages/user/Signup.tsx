import { signup } from '@/apis/signup';
import {
  Button,
  Container,
  Divider,
  Paper,
  Portal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface SignupProps {}
const Signup: React.FC<SignupProps> = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState<Partial<Record<string, string>>>({});
  const [errors, setErrors] = useState<Partial<Message<SignupUser>>>({});
  const [signupInfo, setSignupInfo] = useState<SignupUser>({
    email: '',
    username: '',
    password: '',
    checkPassword: '',
  });
  const mutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: signup,
    onError(error: AxiosError, variables, context) {
      const { response } = error;
      const { data } = response as { data: any };
      console.log(data);

      setModal({
        title: '잘못된 요청',
        content: data.message,
      });
    },
  });

  function validateForm() {
    const errors: Partial<Message<SignupUser>> = {};
    if (signupInfo.email === '') {
      errors['email'] = '필수입니다.';
    }
    if (signupInfo.username === '') {
      errors['username'] = '필수입니다.';
    }
    if (signupInfo.password === '') {
      errors['password'] = '필수입니다.';
    }
    if (signupInfo.checkPassword === '') {
      errors['checkPassword'] = '필수입니다.';
    }
    if (signupInfo.password !== signupInfo.checkPassword) {
      errors['checkPassword'] = '비밀번호를 정확히 입력해주세요.';
      return false;
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    mutation.mutate(signupInfo);

    setSignupInfo({
      email: '',
      username: '',
      password: '',
      checkPassword: '',
    });

    navigate('/');

    return false;
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setSignupInfo((signupInfo) => ({ ...signupInfo, [name]: value }));
  }

  return (
    <Container component={Stack} maxWidth="sm" gap={2}>
      <Portal>
        {modal.title && modal.content && (
          <Paper
            component={Stack}
            p={3}
            minWidth="50%"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
            }}
          >
            <Typography fontSize={24} gutterBottom>
              {modal.title}
            </Typography>
            <Typography className="font-maru" fontSize={15}>
              {modal.content}
            </Typography>
            <Button color="error" onClick={() => setModal({})}>
              닫기
            </Button>
          </Paper>
        )}
      </Portal>
      <Stack component="form" gap={2} onSubmit={handleSubmit} noValidate>
        <Typography fontSize={32} fontWeight={700}>
          회원가입
        </Typography>
        <TextField
          variant="filled"
          label="Email"
          name="email"
          type="email"
          value={signupInfo.email}
          autoComplete="username"
          onChange={onChange}
          required
          error={!!errors['email']}
          helperText={errors['email']}
        />
        <TextField
          variant="filled"
          label="Username"
          name="username"
          type="username"
          value={signupInfo.username}
          autoComplete="username"
          onChange={onChange}
          required
          error={!!errors['username']}
          helperText={errors['username']}
        />
        <TextField
          variant="filled"
          label="Password"
          name="password"
          type="password"
          value={signupInfo.password}
          autoComplete="new-password"
          onChange={onChange}
          required
          error={!!errors['password']}
          helperText={errors['password']}
        />
        <TextField
          variant="filled"
          label="Check Password"
          name="checkPassword"
          type="password"
          value={signupInfo.checkPassword}
          autoComplete="new-password"
          onChange={onChange}
          required
          error={!!errors['checkPassword']}
          helperText={errors['checkPassword']}
        />
        <Divider />
        <Button variant="outlined" size="large" type="submit">
          회원가입
        </Button>
        <Button
          component={Link}
          variant="outlined"
          size="large"
          to="/user/login"
        >
          이미 계정이 있어요
        </Button>
        <Button component={Link} variant="outlined" size="large" to="/">
          메인으로
        </Button>
      </Stack>
    </Container>
  );
};

export default Signup;
