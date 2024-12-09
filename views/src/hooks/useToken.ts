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

  // 로그인
  const loginToken = useCallback(() => {
    localStorage.setItem('logged_in', 'true');
  }, []);

  // 로그아웃
  const logoutToken = useCallback(() => {
    localStorage.setItem('logged_in', 'false');
    setToken({
      user: undefined,
    });
    if (location.pathname.match(guestDisallowPaths)) {
      navigate('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearTokenCheck = useCallback(() => {
    // 최종 로그아웃 처리 확인
    localStorage.setItem('clt', 'true');
  }, []);

  const getMeMutate = useMutation({
    mutationKey: ['getMe'],
    mutationFn: getMe,
    onSuccess(data, variables, context) {
      if (data.ok) {
        setToken({
          user: data.user,
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
      if (data.ok) {
        localStorage.setItem('logged_in', 'true');
        localStorage.setItem('clt', 'false');
        getMeMutate.mutate();
        if (location.pathname.match(userDisallowPaths)) {
          navigate('/');
        }
      }
    },
    onError(error: AxiosError, variables, context) {
      const clt = localStorage.getItem('clt');
      if (clt === 'true') return;
      const loggedIn = localStorage.getItem('logged_in');
      if (loggedIn === 'true') {
        openModal(Message.Expired.Token);
      } else if (error.response?.status === 401) {
        openModal(Message.Expired.Token);
      }
      logoutToken();
      localStorage.setItem('clt', 'true');
    },
  });

  const refetchGetMe = useCallback(() => {
    getMeMutate.mutate();
  }, [getMeMutate]);

  const saveTokenData = useCallback(
    (user: User) => {
      localStorage.setItem('logged_in', 'true');
      setToken({ user });
    },
    [setToken],
  );

  const clearTokenData = useCallback(() => {
    localStorage.setItem('logged_in', 'false');
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
    loginToken,
    logoutToken,
    clearTokenCheck,
  };
};

export default useToken;
