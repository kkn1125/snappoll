import { sidebarAtom } from '@/recoils/sidebar.atom';
import FlexibleMenu from '@components/atoms/FlexibleMenu';
import { List, Stack } from '@mui/material';
import { useRecoilValue } from 'recoil';

interface SidebarProps {}
const Sidebar: React.FC<SidebarProps> = () => {
  const sidebarState = useRecoilValue(sidebarAtom);
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: sidebarState.opened ? 250 : 56,
        overflow: 'hidden',
        transition: '150ms ease-in-out',
      }}
    >
      <FlexibleMenu />
    </List>
  );
};

export default Sidebar;
