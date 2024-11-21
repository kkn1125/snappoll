import { sidebarAtom } from '@/recoils/sidebar.atom';
import InboxIcon from '@mui/icons-material/Inbox';
import {
  Fade,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

interface FlexibleMenuProps {}
const FlexibleMenu: React.FC<FlexibleMenuProps> = () => {
  const sidebarState = useRecoilValue(sidebarAtom);
  const opened = sidebarState.opened;

  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon sx={{ minWidth: 'auto' }}>
          <InboxIcon />
        </ListItemIcon>
        <Fade in={opened}>
          <ListItemText primary="Inbox" sx={{ pl: 3 }} />
        </Fade>
      </ListItemButton>
    </ListItem>
  );
};

export default FlexibleMenu;
