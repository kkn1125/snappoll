import { previousAtom } from '@/recoils/previous.atom';
import { VERSION } from '@common/variables';
import Layout from '@components/templates/Layout';
import ShareLayout from '@components/templates/ShareLayout';
import useLoading from '@hooks/useLoading';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import About from '@pages/About';
import Graph from '@pages/graph/Graph';
import PollGraph from '@pages/graph/polls/PollGraph';
import PollGraphList from '@pages/graph/polls/PollGraphList';
import VoteGraph from '@pages/graph/votes/VoteGraph';
import VoteGraphList from '@pages/graph/votes/VoteGraphList';
import GuestHome from '@pages/GuestHome';
import Home from '@pages/Home';
import Notfound from '@pages/Notfound';
import Notice from '@pages/notice/Notice';
import CreateSnapPoll from '@pages/polls/CreateSnapPoll';
import DetailPoll from '@pages/polls/DetailPoll';
import EditSnapPoll from '@pages/polls/EditSnapPoll';
import MyPolls from '@pages/polls/MyPolls';
import PollListV2 from '@pages/polls/PollListV2';
import PollResponse from '@pages/polls/PollResponse';
import DetailPollResponse from '@pages/polls/response/DetailPollResponse';
import SharePage from '@pages/share/SharePage';
import Choice from '@pages/user/Choice';
import Login from '@pages/user/Login';
import Profile from '@pages/user/Profile';
import Signup from '@pages/user/Signup';
import CreateSnapVote from '@pages/votes/CreateSnapVote';
import DetailVote from '@pages/votes/DetailVote';
import EditSnapVote from '@pages/votes/EditSnapVote';
import MyVotes from '@pages/votes/MyVotes';
import DetailVoteResponse from '@pages/votes/response/DetailVoteResponse';
import VoteList from '@pages/votes/VoteList';
import VoteResponse from '@pages/votes/VoteResponse';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

function AppRouter() {
  const { isCrew, verify } = useToken();
  const [loaded, setLoaded] = useState(false);
  const { closeModal } = useModal();
  const { openLoading, closeLoading } = useLoading();
  const locate = useLocation();
  const setPrevious = useSetRecoilState(previousAtom);

  /* when change page */
  useEffect(() => {
    const pathname = locate.pathname;
    const loggedIn = localStorage.getItem('logged_in');

    if (loggedIn === 'true') verify();

    return () => {
      setPrevious(pathname);
      closeModal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locate.pathname]);

  /* when refresh */
  useEffect(() => {
    openLoading('Loading...');
    /* version save */
    localStorage.setItem('version', VERSION);

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
      <Route element={<Layout isCrew={isCrew} />}>
        <Route index element={isCrew ? <Home /> : <GuestHome />} />
        <Route path="user">
          <Route path="login" element={<Login />}></Route>
          <Route path="choice" element={<Choice />} />
          <Route path="signup" element={<Signup />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="polls">
          <Route index element={<PollListV2 />} />
          <Route path="me" element={<MyPolls />} />
          <Route path="me/response" element={<PollResponse me />} />
          <Route path="new" element={<CreateSnapPoll />} />
          <Route path="edit/:id" element={<EditSnapPoll />} />
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
          <Route path="edit/:id" element={<EditSnapVote />} />
          <Route path=":id" element={<DetailVote />} />
          <Route path=":id/response" element={<VoteResponse />} />
          <Route
            path=":id/response/:responseId"
            element={<DetailVoteResponse />}
          />
        </Route>
        <Route path="graph">
          <Route index element={<Graph />} />
          <Route path="polls">
            <Route index element={<PollGraphList />} />
            <Route path=":id" element={<PollGraph />} />
          </Route>
          <Route path="votes">
            <Route index element={<VoteGraphList />} />
            <Route path=":id" element={<VoteGraph />} />
          </Route>
        </Route>
        <Route path="notice" element={<Notice />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route element={<ShareLayout />}>
        <Route path="share" element={<SharePage />} />
      </Route>
      <Route element={<Layout isCrew={isCrew} />}>
        <Route path="*" element={<Notfound />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
