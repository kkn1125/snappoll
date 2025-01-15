import { Stack, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';

interface CommonLayoutProps {}
const CommonLayout: React.FC<CommonLayoutProps> = () => {
  return (
    <Stack height="inherit" py={5} flex={1}>
      <Outlet />
    </Stack>
  );
};

export default CommonLayout;
