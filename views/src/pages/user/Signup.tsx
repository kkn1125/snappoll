import { signup } from '@/apis/signup';
import {
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Portal,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CasinoIcon from '@mui/icons-material/Casino';
import { getRandomUsername } from '@utils/getRandomUsername';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface SignupProps {}
const Signup: React.FC<SignupProps> = () => {
  const [validated, setValidated] = useState(false);
  const [visible, setVisible] = useState({
    password: false,
    checkPassword: false,
  });
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

      setModal({
        title: '잘못된 요청',
        content: data.message,
      });
    },
  });

  const validateForm = useCallback(() => {
    const errorMessages: Partial<Message<SignupUser>> = {};
    if (signupInfo.email === '') {
      errorMessages['email'] = '필수입니다.';
    }
    if (signupInfo.username === '') {
      errorMessages['username'] = '필수입니다.';
    }
    if (signupInfo.password === '') {
      errorMessages['password'] = '필수입니다.';
    }
    if (signupInfo.checkPassword === '') {
      errorMessages['checkPassword'] = '필수입니다.';
    }
    if (signupInfo.password !== signupInfo.checkPassword) {
      errorMessages['checkPassword'] = '비밀번호를 정확히 입력해주세요.';
    }

    setErrors(errorMessages);

    return Object.keys(errorMessages).length === 0;
  }, [signupInfo]);

  useEffect(() => {
    function handleBeforeUnloaded(e: BeforeUnloadEvent) {
      e.preventDefault();
      return '';
    }
    window.addEventListener('beforeunload', handleBeforeUnloaded, {
      capture: true,
    });
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnloaded, {
        capture: true,
      });
    };
  }, []);

  useEffect(() => {
    if (validated) {
      validateForm();
    }
  }, [validateForm, validated, signupInfo]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidated(true);

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

  function handleRandomUsername(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const randomUsername = getRandomUsername();
    setSignupInfo((signupInfo) => ({
      ...signupInfo,
      username: randomUsername,
    }));
  }

  function handleVisible(name: keyof typeof visible) {
    return () => {
      setVisible((visible) => ({
        ...visible,
        [name]: !visible[name],
      }));
    };
  }

  return (
    <Container component={Stack} maxWidth="sm" gap={2}>
      <Toolbar />
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
      <Stack
        component="form"
        gap={2}
        onSubmit={handleSubmit}
        noValidate
        onKeyUp={(e: FormEvent<HTMLFormElement>) => {
          if (validated) {
            validateForm();
          }
        }}
      >
        <Typography fontSize={32} fontWeight={700} align="center">
          회원가입
        </Typography>
        <TextField
          autoFocus
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
        <Stack position="relative">
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
          <Tooltip title="랜덤" placement="right">
            <IconButton
              onClick={handleRandomUsername}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 5,
                transform: 'translateY(-50%)',
                transition: '150ms ease-in-out',
                ['&:hover']: {
                  transform: 'translateY(-50%) rotate(-15deg)',
                },
              }}
            >
              <CasinoIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack position="relative">
          <TextField
            variant="filled"
            label="Password"
            name="password"
            type={!visible['password'] ? 'password' : 'text'}
            value={signupInfo.password}
            autoComplete="new-password"
            onChange={onChange}
            required
            error={!!errors['password']}
            helperText={errors['password']}
          />
          <IconButton
            onClick={handleVisible('password')}
            sx={{
              position: 'absolute',
              right: 5,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {visible['password'] ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </Stack>
        <Stack position="relative">
          <TextField
            variant="filled"
            label="Check Password"
            name="checkPassword"
            type={!visible['checkPassword'] ? 'password' : 'text'}
            value={signupInfo.checkPassword}
            autoComplete="new-password"
            onChange={onChange}
            required
            error={!!errors['checkPassword']}
            helperText={errors['checkPassword']}
          />
          <IconButton
            onClick={handleVisible('checkPassword')}
            sx={{
              position: 'absolute',
              right: 5,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {visible['checkPassword'] ? (
              <VisibilityOffIcon />
            ) : (
              <VisibilityIcon />
            )}
          </IconButton>
        </Stack>
        <Divider />
        <Button variant="contained" size="large" type="submit">
          회원가입
        </Button>
        <Button
          component={Link}
          variant="contained"
          size="large"
          to="/user/login"
          color="success"
        >
          이미 계정이 있어요
        </Button>
        <Button
          component={Link}
          variant="contained"
          size="large"
          to="/"
          reloadDocument
          color="inherit"
        >
          메인으로
        </Button>
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default Signup;
