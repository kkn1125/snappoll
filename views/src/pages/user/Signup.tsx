import { signup } from '@/apis/signup';
import { previousAtom } from '@/recoils/previous.atom';
import { Message } from '@common/messages';
import CustomInput from '@components/atoms/CustomInput';
import useModal from '@hooks/useModal';
import CasinoIcon from '@mui/icons-material/Casino';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { getRandomUsername } from '@utils/getRandomUsername';
import { AxiosError } from 'axios';
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface SignupProps {}
const Signup: React.FC<SignupProps> = () => {
  const previous = useRecoilValue(previousAtom);
  const [validated, setValidated] = useState(false);
  const { openModal } = useModal();
  const [visible, setVisible] = useState({
    password: false,
    checkPassword: false,
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<ErrorMessage<SignupUser>>({});
  const [signupInfo, setSignupInfo] = useState<SignupUser>({
    email: '',
    username: '',
    password: '',
    checkPassword: '',
  });
  const mutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: signup,
    onSuccess(data, variables, context) {
      // setSignupInfo({
      //   email: '',
      //   username: '',
      //   password: '',
      //   checkPassword: '',
      // });
      navigate('/');
    },
    onError(error: AxiosError, variables, context) {
      const { response } = error;
      const { data } = response as { data: any };
      openModal(Message.WrongRequest(data.message));
    },
  });

  const validateForm = useCallback(() => {
    const errorMessages: ErrorMessage<SignupUser> = {};
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

    return false;
  }

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setSignupInfo((signupInfo) => ({ ...signupInfo, [name]: value }));
  }, []);

  function handleRandomUsername(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const randomUsername = getRandomUsername();
    setSignupInfo((signupInfo) => ({
      ...signupInfo,
      username: randomUsername,
    }));
  }

  const handleVisible = useCallback((e: MouseEvent) => {
    const name = (e.target as HTMLButtonElement).name as keyof typeof visible;
    setVisible((visible) => ({
      ...visible,
      [name]: !visible[name],
    }));
  }, []);

  const emailComponent = useMemo(() => {
    return (
      <CustomInput
        autoFocus
        label="Email"
        name="email"
        type="email"
        value={signupInfo.email}
        autoComplete="username"
        onChange={onChange}
        required
        errors={errors}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupInfo.email, errors.email]);
  const usernameComponent = useMemo(() => {
    return (
      <Stack position="relative">
        <CustomInput
          label="Username"
          name="username"
          type="username"
          value={signupInfo.username}
          autoComplete="username"
          onChange={onChange}
          required
          errors={errors}
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
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupInfo.username, errors.username]);

  const passwordComponent = useMemo(() => {
    return (
      <Stack position="relative">
        <CustomInput
          label="Password"
          name="password"
          type={!visible.password ? 'password' : 'text'}
          value={signupInfo.password}
          autoComplete="new-password"
          onChange={onChange}
          required
          errors={errors}
        />
        <IconButton
          component="button"
          data-name="password"
          onClick={handleVisible}
          sx={{
            position: 'absolute',
            right: 5,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {visible.password ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </Stack>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupInfo.password, visible.password, errors.password]);
  const checkPasswordComponent = useMemo(() => {
    return (
      <Stack position="relative">
        <CustomInput
          label="Check Password"
          name="checkPassword"
          type={!visible.checkPassword ? 'password' : 'text'}
          value={signupInfo.checkPassword}
          autoComplete="new-password"
          onChange={onChange}
          required
          errors={errors}
        />
        <IconButton
          component="button"
          data-name="checkPassword"
          onClick={handleVisible}
          sx={{
            position: 'absolute',
            right: 5,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {visible.checkPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </Stack>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupInfo.checkPassword, visible.checkPassword, errors.checkPassword]);

  return (
    <Container component={Stack} maxWidth="sm" gap={2}>
      <Toolbar />
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
        {emailComponent}
        {usernameComponent}
        {passwordComponent}
        {checkPasswordComponent}
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
          to={previous || '/'}
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
