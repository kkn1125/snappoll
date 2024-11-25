import { sidebarAtom } from '@/recoils/sidebar.atom';
import Footer from '@components/organisms/Footer';
import GuestHeader from '@components/organisms/GuestHeader';
import Header from '@components/organisms/Header';
import Sidebar from '@components/organisms/Sidebar';
import { Box, Stack, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const sidebarWidth = {
  min: 56,
  max: 250,
};
const scrollSize = 5;

interface LayoutProps {
  isCrew?: boolean;
}
const Layout = ({ isCrew = true }) => {
  const sidebarState = useRecoilValue(sidebarAtom);

  return (
    <Stack height="inherit">
      {/* header */}
      <Header isCrew={isCrew}></Header>
      <Toolbar />
      <Stack direction="row" flex={1} position="relative" overflow="hidden">
        {/* Sidebar */}
        {isCrew && (
          <Stack
            overflow="hidden"
            sx={{
              width: '100%',
              maxWidth: sidebarState.opened
                ? sidebarWidth.max
                : sidebarWidth.min,
              transition: '150ms ease-in-out',
              borderRight: '1px solid #eee',
            }}
          >
            <Sidebar />
          </Stack>
        )}

        {/* main */}
        <Stack
          id="main"
          flex={1}
          overflow="auto"
          sx={{
            ['&::-webkit-scrollbar']: {
              width: scrollSize,
              height: scrollSize,
              boxShadow: 'inset 0 0 0 99px #eee',
              background: 'transparent',
            },
            ['&::-webkit-scrollbar-thumb']: {
              width: scrollSize,
              height: scrollSize,
              borderRadius: 0.5,
              backgroundColor: (theme) => theme.palette.sky.dark,
            },
          }}
        >
          <Outlet />
        </Stack>
      </Stack>
      {/* footer */}
      <Footer />
    </Stack>
  );
};

export default Layout;
