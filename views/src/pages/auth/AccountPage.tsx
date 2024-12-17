import { initPass } from '@/apis/initPass';
import { Message } from '@common/messages';
import CustomInput from '@components/atoms/CustomInput';
import useModal from '@hooks/useModal';
import useValidate from '@hooks/useValidate';
import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormLabel,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface AccountPageProps {}
const AccountPage: React.FC<AccountPageProps> = () => {
  const { openModal } = useModal();
  const [data, setData] = useState({ email: '' });
  const { errors, validate, validated, setValidated } = useValidate(data);

  const sendInitPass = useMutation({
    mutationKey: ['initPass'],
    mutationFn: initPass,
    onSuccess(data, variables, context) {
      console.log(data);
    },
  });

  useEffect(() => {
    if (validated) {
      validate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validated, data]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setData({ email: e.target.value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidated(true);
    validate();

    if (!data.email) return;

    sendInitPass.mutate(data);

    openModal({ info: Message.Info.CheckYourEmail });

    return false;
  }

  return (
    <Container maxWidth="sm" sx={{ flex: 1 }}>
      <Stack
        component="form"
        noValidate
        gap={2}
        onSubmit={handleSubmit}
        justifyContent="center"
        height="100%"
      >
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          이메일로 비밀번호 초기화
        </Typography>
        <FormControl>
          <FormLabel sx={{ fontWeight: 700 }}>Email</FormLabel>
          <CustomInput
            name="email"
            type="email"
            autoComplete="current-username"
            required
            autoFocus
            placeholder="youremail@example.com"
            value={data.email}
            errors={errors}
            fullWidth
            disabled={sendInitPass.isSuccess}
            onChange={onChange}
            sx={{
              ['.MuiInputBase-root']: { fontWeight: 700, color: 'GrayText' },
            }}
          />
        </FormControl>
        {!sendInitPass.isSuccess ? (
          <Button
            type="submit"
            size="large"
            variant="outlined"
            sx={{ fontSize: 18 }}
            startIcon={sendInitPass.isPending && <CircularProgress size={18} />}
          >
            비밀번호 초기화 이메일 보내기
          </Button>
        ) : (
          <>
            <Typography color="warning">
              초기화에 성공했습니다. 초기화된 비밀번호로 다시 로그인해주세요.
            </Typography>
            <Button
              component={Link}
              variant="outlined"
              size="large"
              to="/auth/login"
            >
              로그인하기
            </Button>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default AccountPage;
