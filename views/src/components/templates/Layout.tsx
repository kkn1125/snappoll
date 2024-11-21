import Footer from '@components/organisms/Footer';
import Header from '@components/organisms/Header';
import Sidebar from '@components/organisms/Sidebar';
import { Box, Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <Stack>
      {/* header */}
      <Header />
      <Stack direction="row">
        {/* Sidebar */}
        <Sidebar />
        {/* main */}
        <Box flex={1} p={2}>
          <Outlet />
        </Box>
      </Stack>
      {/* footer */}
      <Footer />
    </Stack>
  );
};

export default Layout;
