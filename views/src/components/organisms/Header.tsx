import { sidebarAtom } from '@/recoils/sidebar.atom';
import { BRAND_NAME, logoImage } from '@common/variables';
import ProfileAvatar from '@components/atoms/ProfileAvatar';
import useScroll from '@hooks/useScroll';
import useToken from '@hooks/useToken';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import WidgetsIcon from '@mui/icons-material/Widgets';
import {
  AppBar,
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
import {
  memo,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const locate = useLocation();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState('');
  const { isStart } = useScroll();
  const [sidebarState, setSidebarState] = useRecoilState(sidebarAtom);
  const { user, isCrew } = useToken();
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
  const boardPath = locate.pathname.startsWith('/board');

  const menuList = [
    { name: 'Panel', to: '/panel', allow: ['Admin'] },
    { name: 'SnapPoll이란?', to: '/about', allow: ['Guest', 'User', 'Admin'] },
    { name: '요금제', to: '/price', allow: ['Guest', 'User', 'Admin'] },
    { name: '게시판', to: '/board', allow: ['Guest', 'User', 'Admin'] },
    { name: '서비스', to: '/service', allow: ['User', 'Admin'] },
    {
      name: user?.username,
      to: '/user',
      allow: ['User', 'Admin'],
      icon: (
        <ProfileAvatar
          username={user?.username}
          profileImage={user?.userProfile?.id}
        />
      ),
    },
    { name: '회원가입/로그인', to: '/auth', allow: ['Guest'] },
  ];

  useEffect(() => {
    handleClose();
  }, [isMdDown]);

  function handleToggleSidebar(e: ReactMouseEvent<HTMLElement>) {
    e.stopPropagation();
    setSidebarState((sidebarState) => ({
      ...sidebarState,
      opened: !sidebarState.opened,
    }));
  }

  const headerShadowActivate = useMemo(() => {
    return !isStart;
  }, [isStart]);

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
    setProfileImage(user.userProfile.id);
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
            {(boardPath || isCrew) && (
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
                        user
                          ? allow.includes(user.role)
                          : allow.includes('Guest'),
                      )
                      .map(({ name, to, icon }) => (
                        <MenuItem
                          key={to}
                          onClick={redirectTo(to)}
                          sx={{ gap: 1 }}
                        >
                          {icon}
                          {name}
                        </MenuItem>
                      ))}
                  </Stack>
                </Menu>
              </Stack>
            ) : (
              menuList
                .filter(({ allow }) =>
                  user ? allow.includes(user.role) : allow.includes('Guest'),
                )
                .map(({ name, to, icon }) =>
                  icon ? (
                    <Tooltip
                      key={to}
                      placement="bottom"
                      title={`${user?.username}님 정보`}
                    >
                      <IconButton component={Link} to={to}>
                        {icon}
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Button
                      key={to}
                      component={Link}
                      size="large"
                      color="inherit"
                      to={to}
                    >
                      {name}
                    </Button>
                  ),
                )
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default memo(Header);
