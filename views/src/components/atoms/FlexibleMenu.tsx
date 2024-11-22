import { sidebarAtom } from '@/recoils/sidebar.atom';
import InboxIcon from '@mui/icons-material/Inbox';
import {
  Fade,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface FlexibleMenuProps {
  name: string;
  desc?: string;
  to: string;
}
const FlexibleMenu: React.FC<FlexibleMenuProps> = ({ name, desc, to }) => {
  const navigation = useNavigate();
  const sidebarState = useRecoilValue(sidebarAtom);
  const opened = sidebarState.opened;

  function handleRedirect(to: string) {
    navigation(to);
  }

  return (
    <ListItem disablePadding>
      <Tooltip
        title={name}
        placement="right"
        arrow
        disableFocusListener={opened}
        disableHoverListener={opened}
        disableTouchListener={opened}
      >
        <ListItemButton onClick={() => handleRedirect(to)}>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <InboxIcon />
          </ListItemIcon>
          <Fade in={opened}>
            <ListItemText
              primary={name}
              secondary={desc}
              sx={{ pl: 3, whiteSpace: 'nowrap' }}
            />
          </Fade>
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};

export default FlexibleMenu;
