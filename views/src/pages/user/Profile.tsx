import { getMe } from '@/apis/getMe';
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import { defaultProfile, DefaultProfile } from '@common/variables';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '@/apis/logout';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { tokenAtom } from '@/recoils/token.atom';
import { removeAccount } from '@/apis/removeAccount';
import CustomInput from '@components/atoms/CustomInput';
import useModal from '@hooks/useModal';
import { Message } from '@common/messages';

interface ProfileProps {}
const Profile: React.FC<ProfileProps> = () => {
  const { openInteractiveModal } = useModal();
  const { user } = useRecoilValue(tokenAtom);
  const [current, setCurrent] = useState<
    Partial<
      Omit<User, 'id' | 'userProfile' | 'password' | 'createdAt' | 'updatedAt'>
    >
  >({});
  const [image, setImage] = useState('');

  const logoutMutate = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess(data, variables, context) {
      if (data.ok) {
        localStorage.setItem('logged_in', 'false');
        window.location.pathname = '/';
      }
    },
  });

  const removeAccountMutate = useMutation({
    mutationKey: ['removeAccount'],
    mutationFn: removeAccount,
    onSuccess(data, variables, context) {
      localStorage.setItem('logged_in', 'false');
      window.location.pathname = '/';
    },
  });

  useEffect(() => {
    if (user) {
      const image = user.userProfile?.[0]?.image;
      if (image) {
        const file = new Blob([new Uint8Array(image.data)], {
          type: 'image/jpeg',
        });
        const dataImage = URL.createObjectURL(file);
        setImage(dataImage);
      }
      setCurrent({
        email: user.email,
        username: user.username,
      });
    }
  }, [user]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setCurrent((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleLogout(e: MouseEvent) {
    logoutMutate.mutate();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    openInteractiveModal(Message.Single.Save, () => {
      console.log(current);
    });
    return false;
  }

  function handleRemoveAccount(id?: string) {
    if (id) {
      removeAccountMutate.mutate(id);
    }
  }

  return (
    <Container>
      <Toolbar />
      <Stack direction="row" justifyContent="flex-end">
        <Button
          startIcon={<ExitToAppIcon />}
          color="error"
          variant="outlined"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Stack>
      <Stack gap={3}>
        <Stack alignItems="center" gap={3}>
          <Typography fontSize={32} fontWeight={700} gutterBottom>
            [{user?.username}] 님의 프로필
          </Typography>
          <Stack gap={1}>
            <Stack
              sx={{
                borderRadius: 1,
                overflow: 'hidden',
                backgroundColor: (theme) =>
                  image ? theme.palette.text.disabled : undefined,
              }}
            >
              {image ? (
                <Box
                  component="img"
                  width={300}
                  height={300}
                  src={image}
                  alt="profileImage"
                />
              ) : (
                <Box
                  component="img"
                  src={defaultProfile}
                  width={300}
                  height={300}
                  alt="default_profile"
                />
              )}
            </Stack>
            <Button variant="contained">변경</Button>
          </Stack>
        </Stack>
        <Divider flexItem />
        <Container maxWidth="sm">
          <Stack component="form" gap={2} onSubmit={handleSubmit}>
            <Stack>
              <Typography>Email</Typography>
              <CustomInput
                fullWidth
                size="small"
                name="email"
                type="email"
                autoComplete="new-username"
                value={current.email || ''}
                disabled
                // onChange={onChange}
              />
            </Stack>
            <Stack>
              <Typography>Username</Typography>
              <CustomInput
                fullWidth
                size="small"
                name="username"
                type="text"
                autoComplete="new-username"
                value={current.username || ''}
                onChange={onChange}
              />
            </Stack>

            {/* <Stack>
              <Typography>Password</Typography>
              <TextField
                fullWidth
                size="small"
                name="password"
                type="password"
                autoComplete="new-password"
                value={current.password || ''}
                onChange={onChange}
              />
            </Stack> */}
            <Button type="submit" variant="contained" size="large">
              정보 수정
            </Button>
            <Divider />
            <Button
              color="error"
              variant="outlined"
              size="large"
              onClick={() => {
                openInteractiveModal(Message.Single.LeaveAlert, () => {
                  handleRemoveAccount(user?.id);
                });
              }}
            >
              회원탈퇴
            </Button>
          </Stack>
        </Container>
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default Profile;
