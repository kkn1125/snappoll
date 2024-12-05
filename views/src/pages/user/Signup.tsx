import { signup } from '@/apis/signup';
import { previousAtom } from '@/recoils/previous.atom';
import { Message } from '@common/messages';
import CustomInput from '@components/atoms/CustomInput';
import useModal from '@hooks/useModal';
import useValidate from '@hooks/useValidate';
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
import { WatcherEvent } from '@utils/WatcherEvent';
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
  const mutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: signup,
    onSuccess(data, variables, context) {
      navigate('/');
    },
    onError(error: AxiosError, variables, context) {
      const { response } = error;
      const { data } = response as { data: any };
      openModal(Message.WrongRequest(data.message));
    },
  });

  useEffect(() => {
    //   function handleWatchEvent(e: WatchEvent) {
    //     e.preventDefault();
    //     openInteractiveModal(
    //       {
    //         title: '사이트를 새로고침하시겠습니까?',
    //         content: Message.Single.Redirect,
    //       },
    //       () => {
    //         console.log(e.detail);
    //         if (e.detail.reload) {
    //           if (e.detail.path) {
    //             location.href = location.origin + e.detail.path;
    //           } else {
    //             history.go(0);
    //           }
    //         } else if (e.detail.path) {
    //           navigate(e.detail.path);
    //         }
    //       },
    //     );
    //   }
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      // new WatcherEvent('watch', { detail: { reload: true } });
      e.preventDefault();
      // e.returnValue = '';
      return '';
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    //   window.addEventListener('watch', handleWatchEvent as EventListener);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      //     window.removeEventListener('watch', handleWatchEvent as EventListener);
    };
  }, []);

  // const watcher = useCallback((detail: { path?: string; reload?: boolean }) => {
  //   return new WatcherEvent('watch', {
  //     detail,
  //   });
  // }, []);

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
          to="/user/login"
          reloadDocument
          color="success"
          // onClick={() => {
          //   noSaveModal(() => {
          //     navigate('/user/login');
          //   });
          //   // window.dispatchEvent(watcher({ path: '/user/login' }));
          // }}
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
          // onClick={() => {
          //   noSaveModal(() => {
          //     navigate('/');
          //   });
          //   // window.dispatchEvent(watcher({ path: '/' }));
          // }}
        >
          메인으로
        </Button>
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default Signup;
