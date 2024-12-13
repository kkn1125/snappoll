import { getMe } from '@/apis/getMe';
import { verifyLogin } from '@/apis/verifyLogin';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import { guestDisallowPaths, userDisallowPaths } from '@common/variables';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import useModal from './useModal';

const useToken = () => {
  const navigate = useNavigate();
  const [state, setToken] = useRecoilState(tokenAtom);
  const { openModal } = useModal();

  // 로그아웃
  const logoutToken = useCallback(() => {
    setToken({
      user: undefined,
    });
    if (location.pathname.match(guestDisallowPaths)) {
      navigate('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMeMutate = useMutation<SnapResponseType<User>>({
    mutationKey: ['getMe'],
    mutationFn: getMe,
    onSuccess({ ok, data }, variables, context) {
      if (ok) {
        setToken({
          user: data,
        });
      }
    },
    onError(error, variables, context) {
      logoutToken();
    },
  });

  const verifyMutate = useMutation({
    mutationKey: ['verify'],
    mutationFn: verifyLogin,
    onSuccess(data, variables, context) {
      getMeMutate.mutate();
      if (location.pathname.match(userDisallowPaths)) {
        navigate('/');
      }
    },
    onError(error: AxiosError, variables, context) {
      if (error.code === 'ECONNABORTED') {
        openModal(Message.Info.ServerEConnection);
        return;
      }
      if (error.response?.status === 401) {
        openModal(Message.Expired.Token);
      }
      logoutToken();
    },
  });

  const refetchGetMe = useCallback(() => {
    getMeMutate.mutate();
  }, [getMeMutate]);

  const saveTokenData = useCallback(
    (user: User) => {
      setToken({ user });
    },
    [setToken],
  );

  const clearTokenData = useCallback(() => {
    setToken({ user: undefined });
  }, [setToken]);

  const isCrew = useMemo(() => {
    return !!state.user;
  }, [state.user]);

  return {
    isCrew,
    user: state.user,
    verify: verifyMutate.mutate,
    refetchGetMe,
    saveTokenData,
    clearTokenData,
    logoutToken,
  };
};

export default useToken;
