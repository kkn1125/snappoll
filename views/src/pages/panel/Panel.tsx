import PanelBoard from '@components/organisms/PanelBoard';
import PanelUser from '@components/organisms/PanelUser';
import useToken from '@hooks/useToken';
import { Stack, Toolbar } from '@mui/material';
import NotfoundPage from '@pages/NotfoundPage';
import { useOutletContext } from 'react-router-dom';

interface PanelOutletContext {
  currentTab: number;
}

interface PanelProps {}
const Panel: React.FC<PanelProps> = () => {
  const { currentTab } = useOutletContext<PanelOutletContext>();
  const { user } = useToken();

  if (!user || user.role !== 'Admin') {
    return <NotfoundPage />;
  }

  return (
    <Stack>
      <Toolbar />
      {currentTab === 0 && <PanelUser />}
      {currentTab === 1 && <PanelBoard />}
    </Stack>
  );
};

export default Panel;
