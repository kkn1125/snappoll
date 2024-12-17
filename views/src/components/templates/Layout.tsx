import { messageAtom } from '@/recoils/message.atom';
import { sidebarAtom } from '@/recoils/sidebar.atom';
import { BRAND_NAME, scrollSize } from '@common/variables';
import SnapBreadCrumbs from '@components/atoms/SnapBreadCrumbs';
import SeoMetaTag from '@components/moleculars/SeoMetaTag';
import Footer from '@components/organisms/Footer';
import Header from '@components/organisms/Header';
import Sidebar from '@components/organisms/Sidebar';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import { Box, Stack, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ForumIcon from '@mui/icons-material/Forum';
import EventIcon from '@mui/icons-material/Event';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

const sidebarWidth = {
  min: 56,
  max: 250,
};

interface LayoutProps {
  isCrew?: boolean;
}
const Layout: React.FC<LayoutProps> = ({ isCrew = true }) => {
  const message = useRecoilValue(messageAtom);
  const sidebarState = useRecoilValue(sidebarAtom);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarOpened = isMdDown ? !sidebarState.opened : sidebarState.opened;
  const locate = useLocation();
  const isMain = !isCrew && locate.pathname === '/';
  const boardPath = locate.pathname.startsWith('/board');
  const canonical = useMemo(() => {
    return location.origin + locate.pathname;
  }, [locate.pathname]);

  const guestMenu = [
    { name: '공지사항', path: '/board/notice', icon: <DashboardIcon /> },
    { name: '커뮤니티', path: '/board/community', icon: <ForumIcon /> },
    {
      name: '이벤트',
      path: '/board/event',
      icon: <EventIcon />,
    },
    {
      name: 'FAQ',
      path: '/board/faq',
      icon: <LiveHelpIcon />,
    },
  ];
  const userMenu = [
    { name: '나의 설문지', path: '/service/poll/me', icon: <HistoryEduIcon /> },
    { name: '나의 투표지', path: '/service/vote/me', icon: <HowToVoteIcon /> },
    {
      name: '그래프 보기',
      path: '/service/graph',
      icon: <StackedLineChartIcon />,
    },
    {
      name: '알림',
      path: '/notice',
      icon: <NotificationsIcon />,
      badge: message.notReadMessages.length,
    },
  ];

  return (
    <Stack height="inherit">
      <SeoMetaTag
        canonical={canonical}
        title={BRAND_NAME}
        author={BRAND_NAME}
        description="Snappoll은 쉽고 간편한 무료 설문 및 투표 플랫폼입니다. 커뮤니티를 위한 다양한 설문과 실시간 통계 그래프를 제공해 누구나 손쉽게 투표와 설문을 만들고 분석할 수 있습니다. 지금 무료로 시작하세요!"
        url="https://snappoll.kro.kr"
        site_name="SnapPoll"
        keywords={[
          '설문',
          '투표',
          'SnapPoll',
          '온라인 설문',
          '간편한 설문',
          '설문 통계',
          '투표 통계',
          '무료 설문',
          '무료 투표',
          '무료 통계 그래프',
        ]}
        type="website"
        image="/favicon/apple-touch-icon.png"
      />
      {/* header */}
      <Header isCrew={isCrew} />
      <Toolbar />
      <Stack direction="row" flex={1} position="relative" overflow="hidden">
        {/* Sidebar */}
        {boardPath ? (
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
            <Sidebar menuList={guestMenu} />
          </Stack>
        ) : (
          isCrew && (
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
              <Sidebar menuList={userMenu} />
            </Stack>
          )
        )}

        {/* main */}
        <Stack
          id="main"
          flex={1}
          overflow="auto"
          p={isMain ? 0 : 2}
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
          {!isMain && <Box minHeight={20} maxHeight={20} />}
          <Outlet />
          <Toolbar />
        </Stack>
      </Stack>
      {/* footer */}
      <Footer />
    </Stack>
  );
};

export default Layout;
