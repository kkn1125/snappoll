import { sidebarAtom } from '@/recoils/sidebar.atom';
import { Stack } from '@mui/material';
import { useRecoilValue } from 'recoil';

interface SidebarProps {}
const Sidebar: React.FC<SidebarProps> = () => {
  const sidebarState = useRecoilValue(sidebarAtom);
  return (
    <Stack
      p={2}
      width="100%"
      maxWidth={sidebarState.opened ? 250 : 50}
      overflow="hidden"
      sx={{ transition: '150ms ease-in-out' }}
    >
      side bar222
    </Stack>
  );
};

export default Sidebar;
