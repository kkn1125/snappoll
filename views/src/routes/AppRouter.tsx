import Layout from '@components/templates/Layout';
import Home from '@pages/Home';
import SnapPoll from '@pages/SnapPoll';
import SnapVote from '@pages/SnapVote';
import { Route, Routes } from 'react-router-dom';

function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/poll" element={<SnapPoll />} />
        <Route path="/vote" element={<SnapVote />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
