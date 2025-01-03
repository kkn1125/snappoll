import { sidebarAtom } from '@/recoils/sidebar.atom';
import { scrollSize, SIDEBAR_WIDTH } from '@common/variables';
import HistoryPrevBtn from '@components/atoms/HistoryPrevBtn';
import SnapBreadCrumbs from '@components/atoms/SnapBreadCrumbs';
import Footer from '@components/organisms/Footer';
import Header from '@components/organisms/Header';
import PanelSidebar from '@components/organisms/PanelSidebar';
import useToken from '@hooks/useToken';
import {
  Container,
  Stack,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface PanelLayoutProps {}
const PanelLayout: React.FC<PanelLayoutProps> = () => {
  const { isCrew } = useToken();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarState = useRecoilValue(sidebarAtom);
  const sidebarOpened = isMdDown ? !sidebarState.opened : sidebarState.opened;

  return (
    <Stack height="inherit">
      {/* header */}
      <Header />
      <Toolbar />
      <Stack direction="row" flex={1} position="relative" overflow="hidden">
        {/* Sidebar */}
        <Stack
          id="sidebar"
          overflow="hidden"
          sx={{
            width: '100%',
            maxWidth: sidebarOpened
              ? SIDEBAR_WIDTH.MAX
              : isMdDown
                ? 0
                : SIDEBAR_WIDTH.MIN,
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
          <PanelSidebar
            currentTab={currentTab}
            handleTabChange={handleTabChange}
          />
        </Stack>

        {/* main */}
        <Stack
          id="main"
          flex={1}
          overflow="auto"
          p={2}
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

          <Outlet context={{ currentTab }} />
          <Toolbar />
        </Stack>
      </Stack>
      {/* footer */}
      <Footer />
    </Stack>
  );
};

export default PanelLayout;
