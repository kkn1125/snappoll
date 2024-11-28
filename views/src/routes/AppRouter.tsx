import { getMe } from '@/apis/getMe';
import { verifyLogin } from '@/apis/verifyLogin';
import { tokenAtom } from '@/recoils/token.atom';
import Layout from '@components/templates/Layout';
import useLoading from '@hooks/useLoading';
import useModal from '@hooks/useModal';
import About from '@pages/About';
import Graph from '@pages/graph/Graph';
import GuestHome from '@pages/GuestHome';
import Home from '@pages/Home';
import DetailPoll from '@pages/polls/DetailPoll';
import MyPolls from '@pages/polls/MyPolls';
import PollList from '@pages/polls/PollList';
import PollListV2 from '@pages/polls/PollListV2';
import PreviewPoll from '@pages/polls/PreviewPoll';
import SnapPoll from '@pages/polls/SnapPoll';
import SnapVote from '@pages/SnapVote';
import Login from '@pages/user/Login';
import Profile from '@pages/user/Profile';
import Signup from '@pages/user/Signup';
import MyVotes from '@pages/votes/MyVotes';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

// const skipPath = ['/user/signup', '/user/login'];

function AppRouter() {
  const [loaded, setLoaded] = useState(false);
  const { openModal, closeModal } = useModal();
  const { openLoading, closeLoading } = useLoading();
  const [{ signed }, setToken] = useRecoilState(tokenAtom);
  const navigate = useNavigate();

  const getMeMutate = useMutation({
    mutationKey: ['getMe'],
    mutationFn: getMe,
    onSuccess(data, variables, context) {
      if (data.ok) {
        setToken({
          signed: true,
          user: data.user,
          token: data.token,
          expired: false,
        });
        if (location.pathname.match(/\/user\/(login|signup)\/?(.*)/)) {
          navigate('/');
        }
      }
    },
    onError(error, variables, context) {
      const storage = localStorage.getItem('logged_in');
      if (!storage || storage === 'false') {
        openModal({ title: '안내', content: '로그인이 필요합니다.' });
      } else {
        openModal({
          title: '안내',
          content: '토큰이 만료되었습니다. 다시 로그인해주세요.',
        });
      }
      localStorage.setItem('logged_in', 'false');
      if (location.pathname.match(/\/user\/profile|\/(votes|polls)\/?(.*)/)) {
        navigate('/');
      }
    },
  });

  useEffect(() => {
    openLoading('Loading...');
    const loggedInString = localStorage.getItem('logged_in');
    const loggedIn = JSON.parse(loggedInString || 'false');
    if (loggedIn) {
      getMeMutate.mutate();
    }
    setLoaded(true);
    return () => {
      closeLoading();
      closeModal();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded) {
    return <></>;
  }

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
          <Route index element={<PollListV2 />} />
          <Route path="me" element={<MyPolls />} />
          <Route path="new" element={<SnapPoll />} />
          <Route path="new/preview" element={<PreviewPoll />} />
          <Route path=":id" element={<DetailPoll />} />
        </Route>
        <Route path="votes">
          <Route path="me" element={<MyVotes />} />
          <Route path="new" element={<SnapVote />} />
        </Route>
        <Route path="about" element={<About />} />
        <Route path="graph" element={<Graph />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
