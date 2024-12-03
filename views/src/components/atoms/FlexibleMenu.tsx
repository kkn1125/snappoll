import { sidebarAtom } from '@/recoils/sidebar.atom';
import InboxIcon from '@mui/icons-material/Inbox';
import {
  Badge,
  Fade,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface FlexibleMenuProps {
  name: string;
  desc?: string;
  to: string;
  badge?: number;
}
const FlexibleMenu: React.FC<FlexibleMenuProps> = ({
  name,
  desc,
  to,
  badge,
}) => {
  const navigation = useNavigate();
  const sidebarState = useRecoilValue(sidebarAtom);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const opened = isMdDown ? !sidebarState.opened : sidebarState.opened;

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
            <Fade in={!!badge && !opened}>
              <Badge badgeContent={badge} color="secondary" />
            </Fade>
          </ListItemIcon>
          <Fade in={opened}>
            <ListItemText
              primary={name}
              secondary={desc}
              sx={{ pl: 3, whiteSpace: 'nowrap' }}
            />
          </Fade>
          {!!badge && opened && (
            <Badge badgeContent={badge} color="secondary" />
          )}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};

export default FlexibleMenu;
