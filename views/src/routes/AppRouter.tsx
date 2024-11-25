import Layout from '@components/templates/Layout';
import DetailPoll from '@pages/DetailPoll';
import GuestHome from '@pages/GuestHome';
import Home from '@pages/Home';
import Login from '@pages/user/Login';
import PreviewPoll from '@pages/PreviewPoll';
import SnapPoll from '@pages/SnapPoll';
import SnapVote from '@pages/SnapVote';
import Signup from '@pages/user/Signup';
import { useCookies } from 'react-cookie';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tokenAtom } from '@/recoils/token.atom';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { verifyLogin } from '@/apis/verifyLogin';

function AppRouter() {
  const locate = useLocation();
  const [{ signed }, setToken] = useRecoilState(tokenAtom);

  const mutation = useMutation({
    mutationKey: ['verify'],
    mutationFn: verifyLogin,
    onSuccess(data, variables, context) {
      setToken({
        token: data.token,
        signed: !!data.token,
        expired: false,
      });
      console.log(1);
    },
  });

  useEffect(() => {
    mutation.mutate();
  }, [locate.pathname]);

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
