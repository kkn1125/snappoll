import { checkEmail } from '@/apis/checkEmail';
import { signup } from '@/apis/signup';
import { Message } from '@common/messages';
import CustomInput from '@components/atoms/CustomInput';
import useModal from '@hooks/useModal';
import useValidate from '@hooks/useValidate';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CasinoIcon from '@mui/icons-material/Casino';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Button,
  Container,
  Divider,
  IconButton,
  keyframes,
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

interface SignupPageProps {}
const SignupPage: React.FC<SignupPageProps> = () => {
  const [pendingValidate, setPendingValidate] = useState(false);
  const [emailValidated, setEmailValidated] = useState(false);
  const [validated, setValidated] = useState(false);
  const { openModal, noSaveModal } = useModal();
  const [visible, setVisible] = useState({
    password: false,
    checkPassword: false,
  });
  const navigate = useNavigate();
  const [signupInfo, setSignupInfo] = useState<SignupUser>({
    email: '',
    username: '',
    password: '',
    checkPassword: '',
  });
  const { errors, validate } = useValidate(signupInfo);

  const pendingAnimation = keyframes`
    0%   { transform: rotate(0deg) }
    100% { transform: rotate(359deg) }
  `;

  const checkEmailMutation = useMutation({
    mutationKey: ['checkEmail'],
    mutationFn: checkEmail,
    onSuccess(data, variables, context) {
      setPendingValidate(false);
      setEmailValidated(true);
      openModal(Message.Info.SuccessCheckMail);
    },
    onError(error: AxiosError<AxsiosException>, variables, context) {
      const { response } = error;
      const data = response?.data;
      if (!data) return;

      setPendingValidate(false);
      setEmailValidated(false);
      console.log(response);
      if (response?.status === 409) {
        openModal(Message.WrongRequest(data.errorCode.message));
      }
    },
  });

  const mutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: signup,
    onSuccess(data, variables, context) {
      navigate('/');
    },
    onError(error: AxiosError<AxsiosException>, variables, context) {
      const { response } = error;
      const data = response?.data;
      if (!data) return;

      openModal(Message.WrongRequest(data.errorCode.message));
    },
  });

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      return '';
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (validated) {
      validate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validated, signupInfo]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidated(true);

    if (!validate()) return;

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

  const handleVisible = useCallback((name: keyof typeof visible) => {
    setVisible((visible) => ({
      ...visible,
      [name]: !visible[name],
    }));
  }, []);

  const handleCheckEmail = useCallback(() => {
    if (!validate('onlyEmail')) {
      openModal({ title: '안내', content: '이메일 형식을 확인해주세요.' });
      return;
    }

    if (!signupInfo.email) {
      openModal({ title: '안내', content: '이메일을 입력해주세요.' });
      return;
    }
    checkEmailMutation.mutate(signupInfo.email);
    openModal({
      title: '안내',
      content: '입력한 이메일의 메세지함을 확인해주세요.',
    });

    setPendingValidate(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupInfo.email]);

  const emailComponent = useMemo(() => {
    return (
      <Stack direction="row" gap={2} flexWrap="wrap">
        <CustomInput
          autoFocus
          disabled={pendingValidate || emailValidated}
          label="Email"
          name="email"
          type="email"
          value={signupInfo.email}
          autoComplete="username"
          onChange={onChange}
          required
          errors={errors}
          sx={{ minWidth: 200, flex: 1 }}
        />
        <Stack direction="row" alignItems="center">
          <Tooltip
            title={
              pendingValidate
                ? '이메일 확인 중'
                : emailValidated
                  ? '본인확인 완료'
                  : '이메일 본인인증'
            }
            placement="top"
          >
            <IconButton size="large" color="primary" onClick={handleCheckEmail}>
              {pendingValidate ? (
                <AutorenewIcon
                  sx={{
                    animation: `${pendingAnimation} 1s linear both infinite`,
                  }}
                />
              ) : emailValidated ? (
                <MarkEmailReadIcon />
              ) : (
                <ForwardToInboxIcon fontSize="medium" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailValidated, signupInfo.email, errors, pendingValidate]);

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
          endAdornment={
            <Tooltip title="랜덤" placement="right">
              <IconButton
                onClick={handleRandomUsername}
                sx={{
                  transform: 'rotate(0deg)',
                  transition: '150ms ease-in-out',
                  ['&:hover']: {
                    transform: 'rotate(-15deg)',
                  },
                }}
              >
                <CasinoIcon />
              </IconButton>
            </Tooltip>
          }
        />
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
          endAdornment={
            <IconButton
              component="button"
              data-name="password"
              onClick={() => handleVisible('password')}
            >
              {visible.password ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          }
        />
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
          endAdornment={
            <IconButton
              component="button"
              data-name="checkPassword"
              onClick={() => handleVisible('checkPassword')}
            >
              {visible.checkPassword ? (
                <VisibilityOffIcon />
              ) : (
                <VisibilityIcon />
              )}
            </IconButton>
          }
        />
      </Stack>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupInfo.checkPassword, visible.checkPassword, errors.checkPassword]);

  return (
    <Container component={Stack} maxWidth="sm" gap={2}>
      <Toolbar />
      <Stack component="form" gap={2} onSubmit={handleSubmit} noValidate>
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
          to="/auth/login"
          reloadDocument
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

export default SignupPage;
