import FlexibleMenu from '@components/atoms/FlexibleMenu';
import { List } from '@mui/material';

interface SidebarProps {}
const Sidebar: React.FC<SidebarProps> = () => {
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
    </List>
  );
};

export default Sidebar;
