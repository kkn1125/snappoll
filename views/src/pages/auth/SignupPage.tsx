import { checkEmail } from '@apis/checkEmail';
import { signup } from '@apis/signup';
import { getTerms } from '@apis/terms/getTerms';
import { Message } from '@common/messages';
import CustomInput from '@components/atoms/CustomInput';
import HistoryPrevBtn from '@components/atoms/HistoryPrevBtn';
import useModal from '@hooks/useModal';
import useValidate from '@hooks/useValidate';
import { SnapTerms } from '@models/SnapTerms';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CasinoIcon from '@mui/icons-material/Casino';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  keyframes,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getRandomUsername } from '@utils/getRandomUsername';
import { Logger } from '@utils/Logger';
import { AxiosError } from 'axios';
import {
  ChangeEvent,
  FormEvent,
  Fragment,
  MouseEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';

const logger = new Logger('SignupPage');

interface SignupPageProps {}
const SignupPage: React.FC<SignupPageProps> = () => {
  const [pendingValidate, setPendingValidate] = useState(false);
  const [emailValidated, setEmailValidated] = useState(false);
  const { openModal, openInteractiveModal } = useModal();
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
    privacyPolicy: false,
    serviceAgreement: false,
    receiveMail: false,
  });
  const { errors, validate, validated, setValidated } = useValidate(signupInfo);
  const pendingAnimation = keyframes`
    0%   { transform: rotate(0deg) }
    100% { transform: rotate(359deg) }
  `;

  const { data } = useQuery<SnapResponseType<SnapTerms>>({
    queryKey: ['checkEmail'],
    queryFn: getTerms,
  });

  const checkEmailMutation = useMutation({
    mutationKey: ['checkEmail'],
    mutationFn: checkEmail,
    onSuccess(data, variables, context) {
      setPendingValidate(false);
      setEmailValidated(true);
      openModal({ info: Message.Info.SuccessCheckMail });
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      const { response } = error;
      const data = response?.data;
      if (!data) return;

      setPendingValidate(false);
      setEmailValidated(false);
      logger.error(response);
      if (response?.status === 409) {
        openModal({ info: Message.WrongRequest(data.errorCode.message) });
      }
    },
  });

  const mutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: signup,
    onSuccess(data, variables, context) {
      navigate('/');
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      const { response } = error;
      const data = response?.data;
      if (!data) return;

      openModal({ info: Message.WrongRequest(data.errorCode.message) });
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
      validate('signup');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validated, signupInfo]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidated(true);

    if (!validate('signup')) return;

    mutation.mutate(signupInfo);

    return false;
  }

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setSignupInfo((signupInfo) => ({ ...signupInfo, [name]: value }));
  }, []);

  const onCheckboxChange = useCallback(
    (e: SyntheticEvent, checked: boolean) => {
      const name = (e.target as HTMLInputElement).name;
      const value = checked;
      setSignupInfo((signupInfo) => ({ ...signupInfo, [name]: value }));
    },
    [],
  );

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
      openModal({
        info: { title: '안내', content: '이메일 형식을 확인해주세요.' },
      });
      return;
    }

    if (!signupInfo.email) {
      openModal({ info: { title: '안내', content: '이메일을 입력해주세요.' } });
      return;
    }
    checkEmailMutation.mutate(signupInfo.email);
    openModal({
      info: {
        title: '안내',
        content: '입력한 이메일의 메세지함을 확인해주세요.',
      },
    });

    setPendingValidate(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupInfo.email]);

  const emailComponent = useMemo(() => {
    return (
      <Stack direction="row" gap={2} flexWrap="wrap">
        <CustomInput
          size="small"
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
          endAdornment={
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
              <IconButton
                size="small"
                color="primary"
                onClick={handleCheckEmail}
              >
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
          }
        />
      </Stack>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailValidated, signupInfo.email, errors, pendingValidate]);

  const usernameComponent = useMemo(() => {
    return (
      <Stack position="relative">
        <CustomInput
          size="small"
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
          size="small"
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
          size="small"
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

  const termsSection = data?.data.termsSection;

  const privacyPolicy = useMemo(() => {
    return termsSection?.find(
      (section) => section.title === '개인정보처리방침',
    );
  }, [termsSection]);

  const serviceAgreement = useMemo(() => {
    return termsSection?.find((section) => section.title === '서비스이용동의');
  }, [termsSection]);

  function handleOpenPrivacyPolicy(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    openInteractiveModal({
      content: Message.Single.ServicePolicy,
      slot: (
        <Stack>
          <Divider sx={{ my: 2 }} />
          <Typography component="pre" whiteSpace="pre-wrap">
            {privacyPolicy?.content}
          </Typography>
        </Stack>
      ),
      callback: () => {
        setSignupInfo((signupInfo) => ({
          ...signupInfo,
          privacyPolicy: true,
        }));
      },
      closeCallback: () => {
        setSignupInfo((signupInfo) => ({
          ...signupInfo,
          privacyPolicy: false,
        }));
      },
    });
  }

  function handleOpenServiceAgreement(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    openInteractiveModal({
      content: Message.Single.ServiceAgreement,
      slot: (
        <Stack>
          <Divider sx={{ my: 2 }} />
          <Typography component="pre" whiteSpace="pre-wrap">
            {serviceAgreement?.content}
          </Typography>
        </Stack>
      ),
      callback: () => {
        setSignupInfo((signupInfo) => ({
          ...signupInfo,
          serviceAgreement: true,
        }));
      },
      closeCallback: () => {
        setSignupInfo((signupInfo) => ({
          ...signupInfo,
          serviceAgreement: false,
        }));
      },
    });
  }

  return (
    <Stack
      gap={2}
      flex={1}
      alignItems="center"
      justifyContent="center"
      py={1}
      width={{ xs: '100%', md: '50%' }}
      mx="auto"
    >
      {/* <SignupNotice /> */}
      <Stack
        component="form"
        gap={1}
        onSubmit={handleSubmit}
        noValidate
        width="100%"
      >
        <Stack direction="row" alignItems="center">
          <HistoryPrevBtn
            name="회원가입"
            sx={{ fontSize: 24, fontWeight: 700 }}
          />
        </Stack>
        {emailComponent}
        {usernameComponent}
        {passwordComponent}
        {checkPasswordComponent}
        <Stack>
          <FormControlLabel
            control={<Checkbox disabled />}
            name="privacyPolicy"
            checked={signupInfo.privacyPolicy}
            onChange={onCheckboxChange}
            label={
              <Fragment>
                <Typography
                  fontSize={14}
                  fontWeight={700}
                  sx={{ cursor: 'pointer' }}
                  onClick={handleOpenPrivacyPolicy}
                >
                  개인정보처리방침
                </Typography>
              </Fragment>
            }
          />
          <FormControlLabel
            control={<Checkbox disabled />}
            name="serviceAgreement"
            checked={signupInfo.serviceAgreement}
            onChange={onCheckboxChange}
            label={
              <Fragment>
                <Typography
                  fontSize={14}
                  fontWeight={700}
                  sx={{ cursor: 'pointer' }}
                  onClick={handleOpenServiceAgreement}
                >
                  서비스이용동의
                </Typography>
              </Fragment>
            }
          />
          <FormControlLabel
            control={<Checkbox />}
            name="receiveMail"
            checked={signupInfo.receiveMail}
            onChange={onCheckboxChange}
            label={
              <Fragment>
                <Typography fontSize={14} fontWeight={700}>
                  마케팅 정보 수신 동의 (선택)
                </Typography>
              </Fragment>
            }
          />
        </Stack>
        <Button variant="contained" size="large" type="submit">
          회원가입
        </Button>
        <Button
          component={Link}
          variant="outlined"
          size="large"
          to="/"
          color="inherit"
        >
          메인으로
        </Button>
        <Divider sx={{ my: 1 }} />
        <Typography fontSize={14} color="textSecondary">
          이미 계정이 있으신가요?{' '}
          <Typography
            component={Link}
            color="info"
            to="/auth/login"
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

export default SignupPage;
