import { login } from '@/apis/login';
import { previousAtom } from '@/recoils/previous.atom';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import CustomInput from '@components/atoms/CustomInput';
import useModal from '@hooks/useModal';
import {
  Button,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

interface LoginProps {}
const Login: React.FC<LoginProps> = () => {
  const previous = useRecoilValue(previousAtom);
  const [validated, setValidated] = useState(false);
  const { openModal } = useModal();
  const locate = useLocation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<ErrorMessage<LoginUser>>({});
  const [loginInfo, setLoginInfo] = useState<LoginUser>({
    email: '',
    password: '',
  });
  const setToken = useSetRecoilState(tokenAtom);
  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess(data, _variables, _context) {
      if (data.ok) {
        // setLoginInfo(() => ({
        //   email: '',
        //   password: '',
        // }));
        setToken(() => ({
          token: data.token,
          signed: !!data.token,
          user: data.user,
          expired: false,
        }));
        localStorage.setItem('logged_in', 'true');
        navigate('/');
      }
    },
    onError(error: AxiosError, _variables, _context) {
      const { response } = error;
      const { data } = response as { data: any };

      localStorage.setItem('logged_in', 'false');

      setLoginInfo((loginInfo) => ({
        email: loginInfo.email,
        password: '',
      }));
      console.log(data.message);
      openModal(Message.WrongRequest(data.message));
    },
  });

  const validateForm = useCallback(
    (loginInfo: { email: string; password: string }) => {
      const errors: ErrorMessage<LoginUser> = {};
      if (loginInfo.email === '') {
        errors['email'] = '필수입니다.';
      }
      if (loginInfo.password === '') {
        errors['password'] = '필수입니다.';
      }
      setErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [],
  );

  useEffect(() => {
    window.history.replaceState({}, '');
    if (locate?.state?.type) {
      openModal({
        title: '권한 필요',
        content: '로그인이 필요한 기능입니다.',
      });
    }
  }, [locate?.state?.type, openModal]);

  useEffect(() => {
    if (validated) {
      validateForm(loginInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validated, loginInfo]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setValidated(true);

      if (!validateForm(loginInfo)) return;

      mutation.mutate(loginInfo);

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loginInfo, mutation],
  );

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoginInfo((loginInfo) => ({ ...loginInfo, [name]: value }));
  }, []);

  const memoErrors = useMemo(() => errors, [errors]);

  const onFormChange = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      if (validated) {
        validateForm(loginInfo);
      }
    },
    [loginInfo, validateForm, validated],
  );

  return (
    <Container component={Stack} maxWidth="sm" gap={2}>
      <Toolbar />
      <Stack
        component="form"
        gap={2}
        onSubmit={handleSubmit}
        noValidate
        onChange={onFormChange}
      >
        <Typography fontSize={32} fontWeight={700} align="center">
          로그인
        </Typography>
        <CustomInput
          autoFocus
          label="Email"
          name="email"
          type="email"
          errors={memoErrors}
          value={loginInfo.email}
          autoComplete="username"
          onChange={onChange}
        />
        <CustomInput
          label="Password"
          name="password"
          type="password"
          errors={memoErrors}
          value={loginInfo.password}
          autoComplete="current-password"
          onChange={onChange}
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
          to={previous || '/'}
          color="inherit"
        >
          메인으로
        </Button>
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default Login;
