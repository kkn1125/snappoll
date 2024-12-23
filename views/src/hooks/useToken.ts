import { getMe } from '@/apis/getMe';
import { verifyLogin } from '@/apis/verifyLogin';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import { guestDisallowPaths, userDisallowPaths } from '@common/variables';
import { useMutation } from '@tanstack/react-query';
import { Logger } from '@utils/Logger';
import { AxiosError } from 'axios';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import useModal from './useModal';
import { refreshToken } from '@/apis/refreshToken';

const logger = new Logger('useToken');

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
        setToken((token) => ({ ...token, user: data }));
      }
    },
    onError(error, variables, context) {
      logoutToken();
    },
  });

  const refreshTokenMutate = useMutation({
    mutationKey: ['refreshToken'],
    mutationFn: refreshToken,
    onSuccess(data, variables, context) {
      const leftTime = data.data?.leftTime;
      logger.info('리프레시 완료', leftTime);
    },
  });

  const verifyMutate = useMutation({
    mutationKey: ['verify'],
    mutationFn: verifyLogin,
    onSuccess(data, variables, context) {
      const leftTime = data.data?.leftTime;
      logger.info('로그인 완료', data.data?.leftTime);
      getMeMutate.mutate();
      if (location.pathname.match(userDisallowPaths)) {
        navigate('/');
      }
      setTimeout(() => {
        refreshTokenMutate.mutate();
      }, leftTime * 1000);
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      if (error.code === 'ECONNABORTED') {
        openModal({ info: Message.Info.ServerEConnection });
        return;
      }
      const response = error.response;
      if (response && response.data && response.status === 401) {
        if ([108, 109, 110].includes(response.data.errorCode.errorStatus))
          openModal({
            info: {
              title: '안내',
              content: response.data.errorCode.message,
            },
          });
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
    isMaster: state.user?.role === 'Admin',
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
