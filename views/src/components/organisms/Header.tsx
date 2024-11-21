import { sidebarAtom } from '@/recoils/sidebar.atom';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  keyframes,
  Stack,
  Toolbar,
} from '@mui/material';
import { useRecoilState } from 'recoil';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Link } from 'react-router-dom';
import { logoImage } from '@common/variables';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const [sidebarState, setSidebarState] = useRecoilState(sidebarAtom);

  const action = keyframes`
    0% {transform: rotate(0deg)}
    50% {transform: rotate(-3deg)}
    80% {transform: rotate(-4deg)}
    100% {transform: rotate(-5deg)}
  `;

  function handleToggleSidebar() {
    setSidebarState((sidebarState) => ({
      ...sidebarState,
      opened: !sidebarState.opened,
    }));
  }

  return (
    <AppBar position="absolute" color="inherit" sx={{ top: 0 }}>
      <Toolbar>
        <Stack direction="row" flex={1} justifyContent="space-between" px={2}>
          <Stack direction="row" gap={2}>
            <IconButton
              onClick={handleToggleSidebar}
              color="primary"
              sx={{
                ['& svg']: {
                  transition: '150ms ease-in-out',
                  transform: 'rotate(0)',
                },
                ['&:hover svg']: {
                  transform: 'rotate(-20deg)',
                },
              }}
            >
              {sidebarState.opened ? (
                <MenuOpenRoundedIcon />
              ) : (
                <MenuRoundedIcon />
              )}
            </IconButton>
            <Stack component={Link} to="/">
              <Box
                component="img"
                src={logoImage}
                alt="logo"
                width={40}
                height={40}
              />
            </Stack>
          </Stack>
          <Stack direction="row">
            <Button color="inherit">About</Button>
            <Button color="inherit">Polls</Button>
            <Button color="inherit">Votes</Button>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
