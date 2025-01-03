import { tokenAtom } from '@/recoils/token.atom';
import { login } from '@apis/login';
import { Message } from '@common/messages';
import CustomInput from '@components/atoms/CustomInput';
import HistoryPrevBtn from '@components/atoms/HistoryPrevBtn';
import useModal from '@hooks/useModal';
import useValidate from '@hooks/useValidate';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
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
import { useSetRecoilState } from 'recoil';

interface LoginPageProps {}
const LoginPage: React.FC<LoginPageProps> = () => {
  const setToken = useSetRecoilState(tokenAtom);
  const { openModal, openInteractiveModal } = useModal();
  const locate = useLocation();
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState<LoginDto>({
    email: '',
    password: '',
  });

  const { errors, validate, validated, setValidated } = useValidate(loginInfo);
  const mutation = useMutation<
    SnapResponseType<{ user: User; expiredTime: number }>,
    AxiosError<AxiosException>,
    LoginDto
  >({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess({ ok, data }, _variables, _context) {
      if (ok) {
        const from = locate.state?.from;
        if (from) {
          openInteractiveModal({
            content: [
              '이전에 보던 페이지가 있습니다.',
              '바로 이동하시겠습니까?',
            ],
            callback: () => {
              setToken((token) => ({ ...token, user: data.user }));
              navigate('/');
            },
            closeCallback: () => {
              setToken((token) => ({ ...token, user: data.user }));
              navigate('/');
            },
          });
        } else {
          setToken((token) => ({ ...token, user: data.user }));
          navigate('/');
        }
      }
    },
    onError(error: AxiosError<AxiosException>, _variables, _context) {
      setLoginInfo((loginInfo) => ({
        email: loginInfo.email,
        password: '',
      }));

      if (error.response) {
        const { data } = error.response;

        openModal({ info: Message.WrongRequest(data.errorCode.message) });
      }
    },
  });

  useEffect(() => {
    window.history.replaceState({}, '');
    if (locate?.state?.type) {
      openModal({
        info: {
          title: '권한 필요',
          content: '로그인이 필요한 기능입니다.',
        },
      });
    }
  }, [locate?.state?.type, openModal]);

  useEffect(() => {
    if (validated) {
      validate('login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validated, loginInfo]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setValidated(true);

      if (!validate('login')) return;

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

  return (
    <Stack
      gap={1}
      flex={1}
      alignItems="center"
      justifyContent="center"
      width={{ xs: '100%', md: '50%' }}
      mx="auto"
    >
      <Stack
        component="form"
        gap={1}
        onSubmit={handleSubmit}
        noValidate
        width="100%"
        // onChange={onFormChange}
      >
        <Stack direction="row" alignItems="center">
          <HistoryPrevBtn
            name="로그인"
            sx={{ fontSize: 24, fontWeight: 700 }}
          />
        </Stack>
        <CustomInput
          size="small"
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
          size="small"
          label="Password"
          name="password"
          type="password"
          errors={memoErrors}
          value={loginInfo.password}
          autoComplete="current-password"
          onChange={onChange}
        />

        <Button variant="contained" size="large" type="submit">
          로그인
        </Button>
        <Button component={Link} size="large" to="/auth/signup">
          스냅폴이 처음인가요?
        </Button>
        <Divider sx={{ my: 1 }} />
        <Button
          component={Link}
          variant="outlined"
          size="large"
          to="/"
          color="inherit"
        >
          메인으로
        </Button>
        <Typography
          fontSize={14}
          color="textSecondary"
          sx={{ textDecoration: 'none' }}
        >
          비밀번호를 잊으셨나요?{" "}
          <Typography
            component={Link}
            color="info"
            to="/auth/account"
            fontSize={14}
            fontWeight={700}
            sx={{ textDecoration: 'none' }}
          >
            여기를 눌러주세요.
          </Typography>
        </Typography>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
