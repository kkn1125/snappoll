import { sidebarAtom } from '@/recoils/sidebar.atom';
import Footer from '@components/organisms/Footer';
import Header from '@components/organisms/Header';
import Sidebar from '@components/organisms/Sidebar';
import useSocket from '@hooks/useSocket';
import { Button, Stack, Toolbar, useMediaQuery, useTheme } from '@mui/material';
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
const Layout: React.FC<LayoutProps> = ({ isCrew = true }) => {
  const sidebarState = useRecoilValue(sidebarAtom);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarOpened = isMdDown ? !sidebarState.opened : sidebarState.opened;

  return (
    <Stack height="inherit">
      {/* header */}
      <Header isCrew={isCrew} />
      <Toolbar />
      <Stack direction="row" flex={1} position="relative" overflow="hidden">
        {/* Sidebar */}
        {isCrew && (
          <Stack
            overflow="hidden"
            sx={{
              width: '100%',
              maxWidth: sidebarOpened
                ? sidebarWidth.max
                : isMdDown
                  ? 0
                  : sidebarWidth.min,
              transition: '150ms ease-in-out',
              borderRight: '1px solid #eee',
              backgroundColor: '#fff',
              ...(isMdDown && {
                position: 'absolute',
                zIndex: 5,
                top: 0,
                left: 0,
                bottom: 0,
              }),
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
