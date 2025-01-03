import ReadyAlert from '@components/atoms/ReadyAlert';
import PanelBoard from '@components/organisms/PanelBoard';
import PanelNotice from '@components/organisms/PanelNotice';
import PanelUser from '@components/organisms/PanelUser';
import { Stack, Toolbar } from '@mui/material';
import { useOutletContext } from 'react-router-dom';

interface PanelPageOutletContext {
  currentTab: number;
}

interface PanelPageProps {}
const PanelPage: React.FC<PanelPageProps> = () => {
  const { currentTab } = useOutletContext<PanelPageOutletContext>();

  return (
    <Stack>
      <Toolbar />
      {currentTab === 0 && <PanelUser />}
      {currentTab === 1 && <PanelBoard />}
      {currentTab === 2 && <PanelNotice />}
      {currentTab > 2 && <ReadyAlert />}
    </Stack>
  );
};

export default PanelPage;
