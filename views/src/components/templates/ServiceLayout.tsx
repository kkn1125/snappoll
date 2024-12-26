import { Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';

interface ServiceLayoutProps {}
const ServiceLayout: React.FC<ServiceLayoutProps> = () => {
  return (
    <Stack height="inherit" pt={5}>
      <Outlet />
    </Stack>
  );
};

export default ServiceLayout;
