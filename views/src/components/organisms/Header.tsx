import { sidebarAtom } from '@/recoils/sidebar.atom';
import { tokenAtom } from '@/recoils/token.atom';
import { BRAND_NAME, DefaultProfile, logoImage } from '@common/variables';
import useScroll from '@hooks/useScroll';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import WidgetsIcon from '@mui/icons-material/Widgets';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { getServerProfileImage } from '@utils/getServerProfileImage';
import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

const headerBgChangePoint = 100;

const menuList = [
  { name: 'SnapPoll이란?', to: '/about', allow: ['guest', 'user'] },
  { name: '서비스', to: '/service', allow: ['user'] },
  // { name: '설문조사', to: '/polls', allow: ['user'] },
  // { name: '투표', to: '/votes', allow: ['user'] },
  {
    name: (username?: string) => username,
    to: '/user',
    allow: ['user'],
    icon: (username?: string, profileImage?: string) =>
      username && profileImage ? (
        <Tooltip placement="bottom" title="사용자 정보">
          <Avatar
            src={getServerProfileImage(profileImage)}
            alt={username}
            sx={{
              width: 40,
              height: 40,
              boxShadow: '2px 2px 5px 0 #00000056',
            }}
          />
        </Tooltip>
      ) : (
        <DefaultProfile width={32} height={32} style={{ marginRight: 8 }} />
      ),
  },
  { name: '회원가입/로그인', to: '/auth', allow: ['guest'] },
  // { name: 'Login', to: '/user/login', allow: ['guest'] },
];

interface HeaderProps {
  isCrew: boolean;
}
const Header: React.FC<HeaderProps> = ({ isCrew }) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState('');
  const { current } = useScroll();
  const [sidebarState, setSidebarState] = useRecoilState(sidebarAtom);
  const { user } = useRecoilValue(tokenAtom);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const sidebarOpened = isMdDown ? !sidebarState.opened : sidebarState.opened;

  function handleToggleSidebar(e: ReactMouseEvent<HTMLElement>) {
    e.stopPropagation();
    setSidebarState((sidebarState) => ({
      ...sidebarState,
      opened: !sidebarState.opened,
    }));
  }

  const headerShadowActivate = useMemo(() => {
    return current >= headerBgChangePoint;
  }, [current]);

  useEffect(() => {
    function handleSidebarClose(e: MouseEvent) {
      if (!isMdDown) return;
      const target = e.target as HTMLElement;
      if (!target) return;
      if (target.closest('#toggle-sidebar')) return;
      if (!target.closest('#sidebar')) {
        setSidebarState((sidebarState) => {
          const newState = { ...sidebarState };
          const reverseValue = !sidebarState.opened;
          if (reverseValue) {
            newState.opened = reverseValue;
          }
          return newState;
        });
      }
    }
    window.addEventListener('click', handleSidebarClose);
    return () => {
      window.removeEventListener('click', handleSidebarClose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMdDown]);

  useEffect(() => {
    if (!(user && user?.userProfile)) return;
    if (profileImage) return;
    setProfileImage(user.userProfile.image);
  }, [user, profileImage]);

  function redirectTo(to: string) {
    return () => {
      handleClose();
      navigate(to);
    };
  }

  return (
    <AppBar
      position="absolute"
      color="inherit"
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
                id="toggle-sidebar"
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
                {sidebarOpened ? <MenuOpenRoundedIcon /> : <MenuRoundedIcon />}
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
            {isMdDown ? (
              <Stack alignItems="center">
                <IconButton onClick={handleClick}>
                  <WidgetsIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <Stack>
                    {menuList
                      .filter(({ allow }) =>
                        allow.includes(isCrew ? 'user' : 'guest'),
                      )
                      .map(({ name, to, icon }) => (
                        <MenuItem key={to} onClick={redirectTo(to)}>
                          {icon?.(user?.username, profileImage)}
                          {typeof name === 'string'
                            ? name
                            : name(user?.username)}
                        </MenuItem>
                      ))}
                  </Stack>
                </Menu>
              </Stack>
            ) : (
              menuList
                .filter(({ allow }) =>
                  allow.includes(isCrew ? 'user' : 'guest'),
                )
                .map(({ name, to, icon }) =>
                  typeof name === 'string' ? (
                    <Button
                      key={to}
                      component={Link}
                      size="large"
                      color="inherit"
                      to={to}
                    >
                      {name}
                    </Button>
                  ) : (
                    <IconButton key={to} component={Link} to={to}>
                      {icon?.(user?.username, profileImage)}
                    </IconButton>
                  ),
                )
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
