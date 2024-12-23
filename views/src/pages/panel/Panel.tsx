import PanelBoard from '@components/organisms/PanelBoard';
import PanelUser from '@components/organisms/PanelUser';
import { Stack, Toolbar } from '@mui/material';
import { useOutletContext } from 'react-router-dom';

interface PanelOutletContext {
  currentTab: number;
}

interface PanelProps {}
const Panel: React.FC<PanelProps> = () => {
  const { currentTab } = useOutletContext<PanelOutletContext>();

  return (
    <Stack>
      <Toolbar />
      {currentTab === 0 && <PanelUser />}
      {currentTab === 1 && <PanelBoard />}
    </Stack>
  );
};

export default Panel;
