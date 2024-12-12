import { logout } from '@/apis/logout';
import { removeAccount } from '@/apis/removeAccount';
import { updateProfile } from '@/apis/updateProfile';
import { uploadProfileImage } from '@/apis/uploadProfileImage';
import { Message } from '@common/messages';
import { defaultProfile } from '@common/variables';
import CustomInput from '@components/atoms/CustomInput';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { getImageDataUrl } from '@utils/getImageDataUrl';
import { makeBlobToImageUrl } from '@utils/makeBlobToImageUrl';
import { AxiosError } from 'axios';
import {
  ChangeEvent,
  FormEvent,
  Fragment,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

interface ProfileProps {}
const Profile: React.FC<ProfileProps> = () => {
  const { user, logoutToken, refetchGetMe } = useToken();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const { openModal, openInteractiveModal } = useModal();
  const [current, setCurrent] = useState<
    Partial<
      Omit<User, 'id' | 'userProfile' | 'password' | 'createdAt' | 'updatedAt'>
    >
  >({});
  const [image, setImage] = useState('');

  const updateProfileMutation = useMutation({
    mutationKey: ['updateProfile'],
    mutationFn: updateProfile,
    onSuccess(data, variables, context) {
      openModal(Message.Info.SuccessChangeProfile);
      refetchGetMe();
    },
    onError(error: AxiosError, variables, context) {
      if (
        error.response &&
        error.response.data &&
        error.response.data instanceof Object &&
        'message' in error.response.data
      )
        openModal({
          title: '안내',
          content: error.response.data.message as string,
        });
    },
  });

  const profileUploadMutate = useMutation({
    mutationKey: ['uploadProfile'],
    mutationFn: uploadProfileImage,
    onSuccess(data, variables, context) {
      openModal({ title: '안내', content: '프로필 변경되었습니다.' });
      refetchGetMe();
    },
    onError(error: AxiosError<{ message?: any }>, variables, context) {
      if (!error.response) {
        openModal({ title: '안내', content: '서버에 문제가 발생했습니다.' });
        return;
      }

      if (error.response.status === 401) {
        logoutToken();
      } else {
        openModal({
          title: '안내',
          content: error.response?.data?.message || '잘못된 접근입니다.',
        });
      }
    },
  });

  const logoutMutate = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onMutate(variables) {
      logoutToken();
    },
    onSuccess(data, variables, context) {
      if (data.ok) {
        //
      }
    },
  });

  const removeAccountMutate = useMutation({
    mutationKey: ['removeAccount'],
    mutationFn: removeAccount,
    onSuccess(data, variables, context) {
      logoutToken();
    },
  });

  const isSocial = typeof user?.userProfile?.image === 'string';

  useEffect(() => {
    if (!user) return;
    setCurrent({
      email: user.email,
      username: user.username,
    });

    if (user.userProfile) {
      if (isSocial) {
        setImage(user.userProfile.image as unknown as string);
      } else {
        const { url, revokeUrl } = makeBlobToImageUrl(user.userProfile);
        setImage(url);
        return () => {
          revokeUrl();
        };
      }
    }
  }, [isSocial, user]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setCurrent((current) => ({ ...current, [name]: value }));
  }, []);

  const handleLogout = useCallback((e: MouseEvent) => {
    logoutMutate.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const id = user?.id;
      const username = current.username;
      if (!id || !username) return;
      openInteractiveModal(Message.Single.Save, () => {
        updateProfileMutation.mutate({
          id: id,
          username,
        });
      });
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current],
  );

  const handleRemoveAccount = useCallback((id?: string) => {
    if (id) {
      removeAccountMutate.mutate(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUploadFile(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      setUploadFile(file);
      e.target.value = '';
      const { url } = getImageDataUrl(file, file.type);
      setImage(url);
    }
  }

  const handleSubmitUploadProfile = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (uploadFile) {
        profileUploadMutate.mutate(uploadFile);
        // uploadProfileImage(uploadFile);
      } else {
        openModal({ title: '안내', content: '변경 사항이 없습니다.' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadFile],
  );

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
        <Stack
          alignItems="center"
          gap={3}
          {...(!isSocial && {
            component: 'form',
            onSubmit: handleSubmitUploadProfile,
          })}
        >
          <Typography fontSize={32} fontWeight={700} gutterBottom>
            [{user?.username}] 님의 프로필
          </Typography>
          <Stack gap={4} alignItems="center">
            <Stack
              sx={{
                // background: 'black',
                borderRadius: '100%',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '5px 5px 1rem 0 #55555556',
                // (theme) => image ? theme.palette.text.disabled : undefined,
                width: 300,
              }}
            >
              <Stack component="label">
                {image ? (
                  <Box
                    component="img"
                    width={300}
                    height={300}
                    src={image}
                    alt="profileImage"
                    sx={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      cursor: isSocial ? undefined : 'pointer',
                    }}
                  />
                ) : (
                  <Box
                    component="img"
                    src={defaultProfile}
                    width={300}
                    height={300}
                    alt="default_profile"
                    sx={{ cursor: 'pointer' }}
                  />
                )}
                {!isSocial && (
                  <input
                    hidden
                    type="file"
                    name="profile"
                    accept=".png,.webp,.avif,.jpeg,.jpg"
                    onChange={handleUploadFile}
                  />
                )}
              </Stack>
            </Stack>
            {!isSocial && (
              <Button size="large" variant="contained" type="submit">
                변경
              </Button>
            )}
            {isSocial && (
              <Typography>
                프로필 수정은 스냅폴 회원가입해야 사용가능합니다.
              </Typography>
            )}
          </Stack>
        </Stack>
        {!isSocial && (
          <Fragment>
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
                <Button
                  component={Link}
                  to="/profile/change-pass"
                  variant="outlined"
                  color="warning"
                  size="large"
                >
                  비밀번호 변경
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
          </Fragment>
        )}
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default Profile;
