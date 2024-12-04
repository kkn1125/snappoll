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
  return (
    <List
      sx={{
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <FlexibleMenu
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
      />
    </List>
  );
};

export default Sidebar;
