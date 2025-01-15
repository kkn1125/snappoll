import { logout } from '@apis/logout';
import { cancelSubscription } from '@apis/plan/cancelSubscription';
import { removeAccount } from '@apis/removeAccount';
import { updateProfile } from '@apis/updateProfile';
import { uploadProfileImage } from '@apis/uploadProfileImage';
import { Message } from '@common/messages';
import { defaultProfile } from '@common/variables';
import CustomInput from '@components/atoms/CustomInput';
import CellProgress from '@components/moleculars/CellProgress';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { getImageDataUrl } from '@utils/getImageDataUrl';
import { getServerProfileImage } from '@utils/getServerProfileImage';
import { AxiosError } from 'axios';
import {
  ChangeEvent,
  FormEvent,
  Fragment,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ProfilePageProps {}
const ProfilePage: React.FC<ProfilePageProps> = () => {
  const navigate = useNavigate();
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
      openModal({ info: Message.Info.SuccessChangeProfile });
      refetchGetMe();
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      if (error.response && error.response.data)
        openModal({
          info: {
            title: '안내',
            content: error.response.data.errorCode.message,
          },
        });
    },
  });

  const profileUploadMutate = useMutation({
    mutationKey: ['uploadProfile'],
    mutationFn: uploadProfileImage,
    onSuccess(data, variables, context) {
      openModal({ info: { title: '안내', content: '프로필 변경되었습니다.' } });
      refetchGetMe();
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      if (error.response && error.response.data) {
        openModal({
          info: {
            title: '안내',
            content: error.response.data.errorCode.message,
          },
        });
        return;
      }
    },
  });

  const logoutMutate = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess(data, variables, context) {
      logoutToken();
      navigate('/');
    },
    onError(error, variables, context) {
      logoutToken();
    },
  });

  const removeAccountMutate = useMutation({
    mutationKey: ['removeAccount'],
    mutationFn: removeAccount,
    onSuccess(data, variables, context) {
      logoutToken();
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationKey: ['cancelSubscription'],
    mutationFn: cancelSubscription,
    onSuccess(data, variables, context) {
      refetchGetMe();
    },
  });

  const isSocial = user?.authProvider !== 'Local';

  useEffect(() => {
    if (!user) return;
    setCurrent({
      email: user.email,
      username: user.username,
    });

    if (user.userProfile) {
      setImage(user.userProfile.id);
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
      openInteractiveModal({
        content: Message.Single.Save,
        callback: () => {
          updateProfileMutation.mutate({
            id: id,
            username,
          });
        },
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
        openModal({
          info: { title: '안내', content: '변경 사항이 없습니다.' },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadFile],
  );

  function handleCancelSubscription(subscriptionId: string) {
    cancelSubscriptionMutation.mutate(subscriptionId);
  }

  const currentPlan = useMemo<Subscription | undefined>(() => {
    return user?.subscription;
  }, [user?.subscription]);

  const pollUseAmount = useMemo(() => {
    return user?.poll?.length ?? 0;
  }, [user]);

  const voteUseAmount = useMemo(() => {
    return user?.vote?.length ?? 0;
  }, [user]);

  const limit = useMemo(() => {
    switch (currentPlan?.plan?.planType) {
      case 'Free':
        return 3;
      case 'Basic':
        return 7;
      case 'Premium':
        return 12;
      case 'Enterprise':
        return 30;
      default:
        return 0;
    }
  }, [currentPlan]);

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
                    src={
                      image.startsWith('blob:')
                        ? image
                        : getServerProfileImage(image)
                    }
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
              <Typography
                align="center"
                width={300}
                sx={{ wordBreak: 'auto-phrase' }}
              >
                접속한 계정은 소셜 로그인한 계정입니다.
              </Typography>
            )}
          </Stack>
        </Stack>
        <Divider flexItem />
        <Stack direction="row" alignItems="center" gap={1}>
          {currentPlan ? (
            <>
              <Typography>현재 Plan</Typography>
              <Chip label={currentPlan?.plan?.name} size="small" />
              <Chip label={currentPlan?.type} size="small" />
              {currentPlan.plan?.planType !== 'Free' && (
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => handleCancelSubscription(currentPlan?.id)}
                >
                  구독 취소
                </Button>
              )}
              <Button
                size="small"
                color="info"
                variant="outlined"
                onClick={() => navigate('/price')}
              >
                구독 변경
              </Button>
            </>
          ) : (
            <>
              <Typography>현재 구독 중인 플랜이 없습니다.</Typography>
              <Button onClick={() => navigate('/price')}>구독하기</Button>
            </>
          )}
        </Stack>
        <Stack gap={2}>
          <CellProgress title="설문 사용량" count={pollUseAmount} max={limit} />
          <CellProgress title="투표 사용량" count={voteUseAmount} max={limit} />
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
                    size="large"
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
                    size="large"
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
                  to="/user/password"
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
                    openInteractiveModal({
                      content: Message.Single.LeaveAlert,
                      callback: () => {
                        handleRemoveAccount(user?.id);
                      },
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

export default ProfilePage;
