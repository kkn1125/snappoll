import { sidebarAtom } from '@/recoils/sidebar.atom';
import { scrollSize } from '@common/variables';
import SnapBreadCrumbs from '@components/atoms/SnapBreadCrumbs';
import Footer from '@components/organisms/Footer';
import Header from '@components/organisms/Header';
import Sidebar from '@components/organisms/Sidebar';
import { Stack, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';
import Helmet from 'react-helmet';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const sidebarWidth = {
  min: 56,
  max: 250,
};

interface LayoutProps {
  isCrew?: boolean;
}
const Layout: React.FC<LayoutProps> = ({ isCrew = true }) => {
  const sidebarState = useRecoilValue(sidebarAtom);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarOpened = isMdDown ? !sidebarState.opened : sidebarState.opened;

  const canonical = useMemo(() => {
    return location.origin + location.pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Stack height="inherit">
      <Helmet>
        <link rel="canonical" href={canonical} />
      </Helmet>
      {/* header */}
      <Header isCrew={isCrew} />
      <Toolbar />
      <Stack direction="row" flex={1} position="relative" overflow="hidden">
        {/* Sidebar */}
        {isCrew && (
          <Stack
            id="sidebar"
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
          {isCrew && <SnapBreadCrumbs />}
          <Outlet />
        </Stack>
      </Stack>
      {/* footer */}
      <Footer />
    </Stack>
  );
};

export default Layout;
