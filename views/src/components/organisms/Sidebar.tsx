import { messageAtom } from '@/recoils/message.atom';
import FlexibleMenu from '@components/atoms/FlexibleMenu';
import useSocket from '@hooks/useSocket';
import { Badge, List } from '@mui/material';
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
      {/* <FlexibleMenu name="New Poll" to="/polls/new" />
      <FlexibleMenu name="Quick Vote" to="/votes/new" /> */}
      <FlexibleMenu name="나의 설문지" to="/polls/me" />
      <FlexibleMenu name="나의 투표지" to="/votes/me" />
      <FlexibleMenu name="통계보기" to="/graph" />
      <FlexibleMenu
        name="알림"
        to="/notice"
        badge={message.notReadMessages.length}
      />
    </List>
  );
};

export default Sidebar;
