import { messageAtom } from '@/recoils/message.atom';
import FlexibleMenu from '@components/atoms/FlexibleMenu';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import { List } from '@mui/material';
import { useRecoilValue } from 'recoil';

interface SidebarProps {}
const Sidebar: React.FC<SidebarProps> = () => {
  const message = useRecoilValue(messageAtom);

  const paths = [
    { name: '나의 설문지', path: '/service/poll/me', icon: <HistoryEduIcon /> },
    { name: '나의 투표지', path: '/service/vote/me', icon: <HowToVoteIcon /> },
    // {
    //   name: '내가 응답한 설문지',
    //   path: '/polls/me/response',
    //   icon: <HistoryEduIcon />,
    // },
    // {
    //   name: '내가 응답한 투표지',
    //   path: '/votes/me/response',
    //   icon: <HowToVoteIcon />,
    // },
    { name: '통계보기', path: '/service/graph', icon: <StackedLineChartIcon /> },
    {
      name: '알림',
      path: '/notice',
      icon: <NotificationsIcon />,
      badge: message.notReadMessages.length,
    },
  ];

  return (
    <List
      sx={{
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {paths.map((menu) => (
        <FlexibleMenu
          key={menu.name}
          name={menu.name}
          to={menu.path}
          icon={menu.icon}
          badge={menu.badge}
        />
      ))}
      {/* <FlexibleMenu
        name="나의 설문지"
        to="/polls/me"
        icon={<HistoryEduIcon />}
      />
      <FlexibleMenu
        name="나의 투표지"
        to="/votes/me"
        icon={<HowToVoteIcon />}
      />
      <FlexibleMenu
        name="통계보기"
        to="/graph"
        icon={<StackedLineChartIcon />}
      />
      <FlexibleMenu
        name="알림"
        to="/notice"
        badge={message.notReadMessages.length}
        icon={<NotificationsIcon />}
      /> */}
    </List>
  );
};

export default Sidebar;
