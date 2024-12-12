import { guestDisallowPaths, VERSION } from '@common/variables';
import Layout from '@components/templates/Layout';
import useLoading from '@hooks/useLoading';
import useLogger from '@hooks/useLogger';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import AccountPage from '@pages/auth/AccountPage';
import AuthPage from '@pages/auth/AuthPage';
import LoginPage from '@pages/auth/LoginPage';
import SignupPage from '@pages/auth/SignupPage';
import GuestHomePage from '@pages/GuestHomePage';
import HomePage from '@pages/HomePage';
import Notfound from '@pages/NotfoundPage';
import CreatePollPage from '@pages/service/poll/CreatePollPage';
import PollListPage from '@pages/service/poll/PollListPage';
import ServicePage from '@pages/service/ServicePage';
import MyResponsePage from '@pages/user/MyResponsePage';
import PasswordPage from '@pages/user/PasswordPage';
import ProfilePage from '@pages/user/ProfilePage';
import UserPage from '@pages/user/UserPage';
import { useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import MyPollPage from '@pages/service/poll/MyPollPage';
import ShareLayout from '@components/templates/ShareLayout';
import SharePage from '@pages/service/share/SharePage';
import DetailPollPage from '@pages/service/poll/DetailPollPage';
import ResponsePollPage from '@pages/service/poll/response/ResponsePollPage';
import EditPollPage from '@pages/service/poll/EditPollPage';
import DetailResponsePollPage from '@pages/service/poll/response/DetailResponsePollPage';
import VoteListPage from '@pages/service/vote/VoteListPage';
import CreateVotePage from '@pages/service/vote/CreateVotePage';
import DetailVotePage from '@pages/service/vote/DetailVotePage';
import ResponseVotePage from '@pages/service/vote/response/ResponseVotePage';
import EditVotePage from '@pages/service/vote/EditVotePage';
import MyVotePage from '@pages/service/vote/MyVotePage';
import DetailResponseVotePage from '@pages/service/vote/response/DetailResponseVotePage';
import SelectGraphPage from '@pages/service/graph/SelectGraphPage';
import PollGraphListPage from '@pages/service/graph/polls/PollGraphListPage';
import VoteGraphListPage from '@pages/service/graph/votes/VoteGraphListPage';
import DetailPollGraphPage from '@pages/service/graph/polls/DetailPollGraphPage';
import DetailVoteGraphPage from '@pages/service/graph/votes/DetailVoteGraphPage';
import AboutPage from '@pages/AboutPage';
import NotfoundPage from '@pages/NotfoundPage';
import NoticePage from '@pages/notice/NoticePage';

interface AppRootProps {}
const AppRoot: React.FC<AppRootProps> = () => {
  const { log } = useLogger();
  const { isCrew, verify } = useToken();
  const locate = useLocation();
  const { closeModal } = useModal();
  const { openLoading, closeLoading } = useLoading();

  /* when change page */
  useLayoutEffect(() => {
    log('first and last');
    openLoading('Loading...');
    /* version save */
    localStorage.setItem('version', VERSION);

    return () => {
      closeLoading();
      closeModal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const pathname = locate.pathname;
    const loggedIn = localStorage.getItem('logged_in');

    if (loggedIn === 'true' || guestDisallowPaths.test(pathname)) verify();

    return () => {
      // setPrevious(pathname);
      closeModal();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locate.pathname]);

  return (
    <Routes>
      <Route element={<Layout isCrew={isCrew} />}>
        <Route index element={isCrew ? <HomePage /> : <GuestHomePage />} />
        <Route path="notice" element={<NoticePage />} />
        <Route path="about" element={<AboutPage />} />

        {/* Authentications */}
        <Route path="auth">
          <Route index element={<AuthPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>

        {/* User */}
        <Route path="user">
          <Route index element={<UserPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="password" element={<PasswordPage />} />
          <Route path="response" element={<MyResponsePage />} />
        </Route>

        {/* Service */}
        <Route path="service">
          <Route index element={<ServicePage />} />

          {/* Poll */}
          <Route path="poll">
            <Route index element={<PollListPage />} />
            <Route path="new" element={<CreatePollPage />} />
            <Route path=":id" element={<DetailPollPage />} />
            <Route path=":id/response" element={<ResponsePollPage />} />
            <Route path="edit/:id" element={<EditPollPage />} />
            <Route
              path=":id/response/:responseId"
              element={<DetailResponsePollPage />}
            />

            {/* User's */}
            <Route path="me">
              <Route index element={<MyPollPage />} />
              <Route path="response" element={<ResponsePollPage me />} />
            </Route>
          </Route>

          {/* Vote */}
          <Route path="vote">
            <Route index element={<VoteListPage />} />
            <Route path="new" element={<CreateVotePage />} />
            <Route path=":id" element={<DetailVotePage />} />
            <Route path=":id/response" element={<ResponseVotePage />} />
            <Route path="edit/:id" element={<EditVotePage />} />
            <Route
              path=":id/response/:responseId"
              element={<DetailResponseVotePage />}
            />

            {/* User's */}
            <Route path="me">
              <Route index element={<MyVotePage />} />
              <Route path="response" element={<ResponseVotePage me />} />
            </Route>
          </Route>

          {/* Graph */}
          <Route path="graph">
            {/* List */}
            <Route index element={<SelectGraphPage />} />

            {/* Poll */}
            <Route path="poll">
              <Route index element={<PollGraphListPage />} />
              <Route path=":id" element={<DetailPollGraphPage />} />
            </Route>

            {/* Vote */}
            <Route path="vote">
              <Route index element={<VoteGraphListPage />} />
              <Route path=":id" element={<DetailVoteGraphPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Service use an other layout */}
      <Route path="service">
        <Route path="poll">
          <Route element={<ShareLayout />}>
            <Route path="share" element={<SharePage />} />
          </Route>
        </Route>
        <Route path="vote">
          <Route element={<ShareLayout />}>
            <Route path="share" element={<SharePage />} />
          </Route>
        </Route>
      </Route>

      {/* Notfound Page */}
      <Route element={<Layout isCrew={isCrew} />}>
        <Route path="*" element={<NotfoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoot;
