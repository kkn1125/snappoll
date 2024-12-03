import { getMe } from '@/apis/getMe';
import { verifyLogin } from '@/apis/verifyLogin';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import Layout from '@components/templates/Layout';
import useLoading from '@hooks/useLoading';
import useModal from '@hooks/useModal';
import About from '@pages/About';
import Graph from '@pages/graph/Graph';
import GuestHome from '@pages/GuestHome';
import Home from '@pages/Home';
import CreateSnapPoll from '@pages/polls/CreateSnapPoll';
import DetailPoll from '@pages/polls/DetailPoll';
import MyPolls from '@pages/polls/MyPolls';
import PollListV2 from '@pages/polls/PollListV2';
import Login from '@pages/user/Login';
import Profile from '@pages/user/Profile';
import Signup from '@pages/user/Signup';
import MyVotes from '@pages/votes/MyVotes';
import CreateSnapVote from '@pages/votes/CreateSnapVote';
import VoteList from '@pages/votes/VoteList';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { previousAtom } from '@/recoils/previous.atom';
import DetailVote from '@pages/votes/DetailVote';
import PollResponse from '@pages/polls/PollResponse';
import DetailPollResponse from '@pages/polls/response/DetailPollResponse';
import VoteResponse from '@pages/votes/VoteResponse';
import Notice from '@pages/notice/Notice';

function AppRouter() {
  const [loaded, setLoaded] = useState(false);
  const { openModal, closeModal } = useModal();
  const { openLoading, closeLoading } = useLoading();
  const [{ signed }, setToken] = useRecoilState(tokenAtom);
  const navigate = useNavigate();
  const locate = useLocation();
  const setPrevious = useSetRecoilState(previousAtom);

  const clearToken = useCallback(() => {
    localStorage.setItem('logged_in', 'false');
    setToken({
      signed: false,
      user: undefined,
      token: undefined,
      expired: true,
    });
    if (locate.pathname.match(/\/user\/profile|\/(votes|polls)\/?(.*)/)) {
      navigate('/');
    }
  }, [locate.pathname, navigate, setToken]);

  const verifyMutate = useMutation({
    mutationKey: ['verify'],
    mutationFn: verifyLogin,
    onError(error, variables, context) {
      const loggedIn = localStorage.getItem('logged_in');
      if (loggedIn === 'true') {
        openModal(Message.Expired.Token);
      }
      clearToken();
    },
  });

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
      const loggedIn = localStorage.getItem('logged_in');
      if (!loggedIn || loggedIn === 'false') {
        openModal(Message.Require.Login);
      }
      clearToken();
    },
  });

  useEffect(() => {
    const pathname = location.pathname;
    return () => {
      setPrevious(pathname);
      closeModal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('logged_in');
    if (loggedIn === 'true' && signed) {
      verifyMutate.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, signed]);

  useEffect(() => {
    openLoading('Loading...');
    const loggedIn = localStorage.getItem('logged_in');
    if (loggedIn === 'true') {
      getMeMutate.mutate();
    } else {
      clearToken();
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
          <Route path="new" element={<CreateSnapPoll />} />
          {/* <Route path="new/preview" element={<PreviewPoll />} /> */}
          <Route path=":id" element={<DetailPoll />} />
          <Route path=":id/response" element={<PollResponse />} />
          <Route
            path=":id/response/:responseId"
            element={<DetailPollResponse />}
          />
        </Route>
        <Route path="votes">
          <Route index element={<VoteList />} />
          <Route path="me" element={<MyVotes />} />
          <Route path="new" element={<CreateSnapVote />} />
          <Route path=":id" element={<DetailVote />} />
          <Route path=":id/response" element={<VoteResponse />} />
        </Route>
        <Route path="about" element={<About />} />
        <Route path="graph" element={<Graph />} />
        <Route path="notice" element={<Notice />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
