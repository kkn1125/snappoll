import { scrollSize } from '@common/variables';
import { Alert, AlertTitle, Container, Stack, Toolbar } from '@mui/material';
import { Outlet, useSearchParams } from 'react-router-dom';

interface ShareLayoutProps {}
const ShareLayout: React.FC<ShareLayoutProps> = () => {
  const [param] = useSearchParams();
  const url = param.get('url');
  const name = url?.slice(7, url?.indexOf('-', 7));
  const label = name === 'poll' ? '설문' : '투표';

  return (
    <Stack
      height="inherit"
      overflow="auto"
      sx={{
        ['&::-webkit-scrollbar']: {
          width: scrollSize,
          height: scrollSize,
          boxShadow: 'inset 0 0 0 99px #eee',
          background: 'transparent',
        },
        ['&::-webkit-scrollbar-thumb']: {
          width: scrollSize,
          height: scrollSize,
          borderRadius: 0.5,
          backgroundColor: (theme) => theme.palette.sky.dark,
        },
      }}
    >
      <Toolbar />
      <Stack height="inherit">
        <Outlet />
      </Stack>
      <Toolbar />
    </Stack>
  );
};

export default ShareLayout;
