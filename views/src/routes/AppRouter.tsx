import { verifyLogin } from '@/apis/verifyLogin';
import { tokenAtom } from '@/recoils/token.atom';
import Layout from '@components/templates/Layout';
import useLoading from '@hooks/useLoading';
import useModal from '@hooks/useModal';
import About from '@pages/About';
import GuestHome from '@pages/GuestHome';
import Home from '@pages/Home';
import DetailPoll from '@pages/polls/DetailPoll';
import PreviewPoll from '@pages/polls/PreviewPoll';
import SnapPoll from '@pages/polls/SnapPoll';
import SnapVote from '@pages/SnapVote';
import Login from '@pages/user/Login';
import Profile from '@pages/user/Profile';
import Signup from '@pages/user/Signup';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

const skipPath = ['/user/signup', '/user/login'];

function AppRouter() {
  const { openModal } = useModal();
  const locate = useLocation();
  const navigate = useNavigate();
  const { updateLoading } = useLoading();
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
        username: data.username,
        profile: data.profile,
        signed: !!data.token,
        expired: false,
      });
      updateLoading();
    },
    onError(error, variables, context) {
      setToken({
        token: undefined,
        userId: undefined,
        username: undefined,
        profile: undefined,
        signed: false,
        expired: true,
      });
      if (
        locate.pathname.match(/\/(polls|votes)\/?(.+)/) ||
        !skipPath.includes(locate.pathname)
      ) {
        navigate('/');
      }
      // removeCookie('token', { secure: true, httpOnly: true, sameSite: 'lax' });
    },
  });

  useEffect(() => {
    // openLoading('Loading...');

    mutation.mutate();

    if (signed && skipPath.includes(locate.pathname)) {
      // 로그인 후 login, signup 페이지 제한
      navigate('/');
      // openModal({ title: '잘못된 접근', content: '이미 로그인 상태입니다.' });
    }

    // return () => {
    //   updateLoading();
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signed, locate.pathname]);

  return (
    <Routes>
      <Route element={<Layout isCrew={signed} />}>
        <Route path="user">
          <Route path="login" element={<Login />}></Route>
          <Route path="signup" element={<Signup />}></Route>
          <Route path="profile" element={<Profile />}></Route>
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
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
