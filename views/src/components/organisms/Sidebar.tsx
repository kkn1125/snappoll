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
      <FlexibleMenu name="New Poll" to="/polls/new" />
      <FlexibleMenu name="Quick Vote" to="/votes/new" />
    </List>
  );
};

export default Sidebar;
