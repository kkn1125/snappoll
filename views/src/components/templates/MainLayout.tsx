import { Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {}
const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <Stack height="inherit">
      <Outlet />
    </Stack>
  );
};

export default MainLayout;
