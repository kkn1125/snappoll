import { Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';

interface CommonLayoutProps {}
const CommonLayout: React.FC<CommonLayoutProps> = () => {
  return (
    <Stack height="inherit" pt={5}>
      <Outlet />
    </Stack>
  );
};

export default CommonLayout;
