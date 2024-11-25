import { verifyLogin } from '@/apis/verifyLogin';
import { tokenAtom } from '@/recoils/token.atom';
import Layout from '@components/templates/Layout';
import { Stack, Typography } from '@mui/material';
import DetailPoll from '@pages/DetailPoll';
import GuestHome from '@pages/GuestHome';
import Home from '@pages/Home';
import PreviewPoll from '@pages/PreviewPoll';
import SnapPoll from '@pages/SnapPoll';
import SnapVote from '@pages/SnapVote';
import Login from '@pages/user/Login';
import Signup from '@pages/user/Signup';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';

function AppRouter() {
  const locate = useLocation();
  const [{ signed }, setToken] = useRecoilState(tokenAtom);

  const mutation = useMutation({
    mutationKey: ['verify'],
    mutationFn: verifyLogin,
    retryDelay(failureCount, error) {
      return Math.min(1000 * Math.pow(2, failureCount - 1), 5000);
    },
    onSuccess(data, variables, context) {
      setToken({
        token: data.token,
        userId: data.userId,
        signed: !!data.token,
        expired: false,
      });
    },
    onError(error, variables, context) {
      setToken({
        token: undefined,
        userId: undefined,
        signed: false,
        expired: true,
      });
      // removeCookie('token', { secure: true, httpOnly: true, sameSite: 'lax' });
    },
  });

  useEffect(() => {
    mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locate.pathname]);

  if (!signed && (mutation.isIdle || mutation.isPending)) {
    return (
      <Stack alignItems="center" height="inherit" justifyContent="center">
        <Typography fontSize={42} fontWeight={700}>
          Loading...
        </Typography>
      </Stack>
    );
  }

  return (
    <Routes>
      <Route element={<Layout isCrew={signed} />}>
        <Route path="user">
          <Route path="login" element={<Login />}></Route>
          <Route path="signup" element={<Signup />}></Route>
        </Route>
        <Route index element={signed ? <Home /> : <GuestHome />} />
        <Route path="polls">
          <Route path="new" element={<SnapPoll />} />
          <Route path="new/preview" element={<PreviewPoll />} />
          <Route path=":id" element={<DetailPoll />} />
        </Route>
        <Route path="votes">
          <Route path="new" element={<SnapVote />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;
