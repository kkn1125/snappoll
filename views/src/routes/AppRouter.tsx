import Layout from '@components/templates/Layout';
import DetailPoll from '@pages/DetailPoll';
import Home from '@pages/Home';
import SnapPoll from '@pages/SnapPoll';
import SnapVote from '@pages/SnapVote';
import { Route, Routes } from 'react-router-dom';

function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="polls">
          <Route path="new" element={<SnapPoll />} />
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
