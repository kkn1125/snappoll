import { getMe } from '@/apis/getMe';
import { verifyLogin } from '@/apis/verifyLogin';
import { previousAtom } from '@/recoils/previous.atom';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import { VERSION } from '@common/variables';
import Layout from '@components/templates/Layout';
import useLoading from '@hooks/useLoading';
import useModal from '@hooks/useModal';
import About from '@pages/About';
import Graph from '@pages/graph/Graph';
import GuestHome from '@pages/GuestHome';
import Home from '@pages/Home';
import Notice from '@pages/notice/Notice';
import CreateSnapPoll from '@pages/polls/CreateSnapPoll';
import DetailPoll from '@pages/polls/DetailPoll';
import MyPolls from '@pages/polls/MyPolls';
import PollListV2 from '@pages/polls/PollListV2';
import PollResponse from '@pages/polls/PollResponse';
import DetailPollResponse from '@pages/polls/response/DetailPollResponse';
import Login from '@pages/user/Login';
import Profile from '@pages/user/Profile';
import Signup from '@pages/user/Signup';
import CreateSnapVote from '@pages/votes/CreateSnapVote';
import DetailVote from '@pages/votes/DetailVote';
import MyVotes from '@pages/votes/MyVotes';
import DetailVoteResponse from '@pages/votes/response/DetailVoteResponse';
import VoteList from '@pages/votes/VoteList';
import VoteResponse from '@pages/votes/VoteResponse';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

const guestDisallowPaths =
  /\/user\/profile|\/(votes|polls|notice|graph)\/?(.*)/;
const userDisallowPaths = /\/user\/(login|signup)\/?(.*)/;

function AppRouter() {
  const [loaded, setLoaded] = useState(false);
  const { openModal, closeModal } = useModal();
  const { openLoading, closeLoading } = useLoading();
  const [{ signed }, setToken] = useRecoilState(tokenAtom);
  const navigate = useNavigate();
  const setPrevious = useSetRecoilState(previousAtom);

  const clearToken = useCallback(() => {
    localStorage.setItem('logged_in', 'false');
    setToken({
      signed: false,
      user: undefined,
      token: undefined,
      expired: true,
    });
    if (location.pathname.match(guestDisallowPaths)) {
      navigate('/');
    }
  }, [navigate, setToken]);

  const verifyMutate = useMutation({
    mutationKey: ['verify'],
    mutationFn: verifyLogin,
    onError(error: AxiosError, variables, context) {
      const loggedIn = localStorage.getItem('logged_in');
      if (loggedIn === 'true') {
        openModal(Message.Expired.Token);
      } else if (error.response?.status === 401) {
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
        if (location.pathname.match(userDisallowPaths)) {
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
    /* version save */
    localStorage.setItem('version', VERSION);

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
          <Route path="me/response" element={<PollResponse me />} />
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
          <Route path="me/response" element={<VoteResponse me />} />
          <Route path="new" element={<CreateSnapVote />} />
          <Route path=":id" element={<DetailVote />} />
          <Route path=":id/response" element={<VoteResponse />} />
          <Route
            path=":id/response/:responseId"
            element={<DetailVoteResponse />}
          />
        </Route>
        <Route path="about" element={<About />} />
        <Route path="graph" element={<Graph />} />
        <Route path="notice" element={<Notice />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
