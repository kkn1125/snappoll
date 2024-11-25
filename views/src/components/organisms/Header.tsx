import { sidebarAtom } from '@/recoils/sidebar.atom';
import { BRAND_NAME, logoImage } from '@common/variables';
import useScroll from '@hooks/useScroll';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';

const headerBgChangePoint = 100;

interface HeaderProps {
  isCrew: boolean;
}
const Header: React.FC<HeaderProps> = ({ isCrew }) => {
  const { current } = useScroll();
  const [sidebarState, setSidebarState] = useRecoilState(sidebarAtom);

  function handleToggleSidebar() {
    setSidebarState((sidebarState) => ({
      ...sidebarState,
      opened: !sidebarState.opened,
    }));
  }

  const headerShadowActivate = useMemo(() => {
    return current >= headerBgChangePoint;
  }, [current]);

  return (
    <AppBar
      position="absolute"
      color={headerShadowActivate ? 'sky' : 'inherit'}
      sx={{
        top: 0,
        transition:
          'background-color 150ms ease-in-out, box-shadow 150ms ease-in-out',
        ...(!headerShadowActivate && {
          '--Paper-shadow': '0 0 0 0 #ffffffff !important',
        }),
        borderBottom: '1px solid #eee',
      }}
    >
      <Toolbar>
        <Stack direction="row" flex={1} justifyContent="space-between" px={2}>
          <Stack direction="row" gap={2}>
            {isCrew && (
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
            )}
            <Stack
              component={Link}
              to="/"
              direction="row"
              gap={1}
              alignItems="center"
              color="inherit"
              sx={{
                textDecoration: 'none',
              }}
            >
              <Box
                component="img"
                src={logoImage}
                alt="logo"
                width={32}
                height={32}
              />
              <Typography fontSize={24} fontWeight={700}>
                {BRAND_NAME}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row">
            <Button component={Link} size="large" color="inherit" to="/about">
              About
            </Button>
            {isCrew ? (
              <>
                <Button
                  component={Link}
                  size="large"
                  color="inherit"
                  to="/polls"
                >
                  Polls
                </Button>
                <Button
                  component={Link}
                  size="large"
                  color="inherit"
                  to="/votes"
                >
                  Votes
                </Button>
                <Button
                  component={Link}
                  size="large"
                  color="inherit"
                  to="/user/profile"
                >
                  Profiles
                </Button>
              </>
            ) : (
              <Button
                component={Link}
                size="large"
                color="inherit"
                to="/user/signup"
              >
                Signup
              </Button>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
