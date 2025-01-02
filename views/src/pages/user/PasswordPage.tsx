import { changePass } from '@apis/changePass';
import { Message } from '@common/messages';
import CustomInput from '@components/atoms/CustomInput';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import useValidate from '@hooks/useValidate';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

interface PasswordPageProps {}
const PasswordPage: React.FC<PasswordPageProps> = () => {
  const { user } = useToken();
  const [data, setData] = useState({
    currentPassword: '',
    password: '',
    checkPassword: '',
  });
  const [visible, setVisible] = useState({
    currentPassword: false,
    password: false,
    checkPassword: false,
  });
  const navigate = useNavigate();
  const { openModal, openInteractiveModal } = useModal();
  const { errors, validate, validated, setValidated } = useValidate(data);

  const changePassword = useMutation({
    mutationKey: ['changePass'],
    mutationFn: changePass,
    onSuccess(data, variables, context) {
      openInteractiveModal({
        content: Message.Info.SuccessChangePassword.content,
        callback: () => {
          navigate(-1);
        },
        closeCallback: () => {
          navigate(-1);
        },
      });
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      if (error.response && error.response.data) {
        openModal({
          info: {
            title: '안내',
            content: error.response.data.errorCode.message,
          },
        });
      }
    },
  });

  useEffect(() => {
    if (validated) {
      validate('passwordChange');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validated, data]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  }

  const handleVisible = useCallback((name: keyof typeof visible) => {
    setVisible((visible) => ({
      ...visible,
      [name]: !visible[name],
    }));
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidated(true);
    const id = user?.id;
    if (!id || !data.password || data.password !== data.checkPassword) return;

    if (!validate('passwordChange')) return;

    const { currentPassword, password } = data;
    changePassword.mutate({ id, password, currentPassword });

    return false;
  }

  return (
    <Container maxWidth="sm" sx={{ flex: 1, height: 'inherit' }}>
      <Stack
        component="form"
        onSubmit={handleSubmit}
        gap={2}
        sx={{ height: 'inherit' }}
      >
        <FormControl>
          <FormLabel sx={{ fontWeight: 700 }}>현재 비밀번호</FormLabel>
          <CustomInput
            required
            name="currentPassword"
            type={!visible.currentPassword ? 'password' : 'text'}
            autoFocus
            autoComplete="current-password"
            value={data.currentPassword}
            onChange={onChange}
            errors={errors}
            endAdornment={
              <IconButton
                component="button"
                data-name="password"
                onClick={() => handleVisible('currentPassword')}
              >
                {visible.currentPassword ? (
                  <VisibilityOffIcon />
                ) : (
                  <VisibilityIcon />
                )}
              </IconButton>
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel sx={{ fontWeight: 700 }}>변경할 비밀번호</FormLabel>
          <CustomInput
            required
            name="password"
            type={!visible.password ? 'password' : 'text'}
            autoFocus
            autoComplete="new-password"
            value={data.password}
            onChange={onChange}
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
        </FormControl>
        <FormControl>
          <FormLabel sx={{ fontWeight: 700 }}>비밀번호 확인</FormLabel>
          <CustomInput
            required
            name="checkPassword"
            type={!visible.checkPassword ? 'password' : 'text'}
            autoComplete="current-password"
            value={data.checkPassword}
            onChange={onChange}
            errors={errors}
            endAdornment={
              <IconButton
                component="button"
                data-name="password"
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
        </FormControl>
        <Button
          type="submit"
          variant="outlined"
          color="info"
          size="large"
          startIcon={
            !changePassword.isSuccess &&
            changePassword.isPending && <CircularProgress size={18} />
          }
          disabled={changePassword.isSuccess}
        >
          비밀번호 변경하기
        </Button>
      </Stack>
    </Container>
  );
};

export default PasswordPage;
