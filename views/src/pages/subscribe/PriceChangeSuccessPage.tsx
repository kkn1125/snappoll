import useLogger from '@hooks/useLogger';
import useToken from '@hooks/useToken';
import { Box, Button, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface PriceChangeSuccessPageProps {}
const PriceChangeSuccessPage: React.FC<PriceChangeSuccessPageProps> = () => {
  const { debug } = useLogger('PriceChangeSuccessPage');
  const { refetchGetMe } = useToken();
  const { state } = useLocation();
  const billing = state.billing;
  const message = state.message;

  debug(billing, message);

  useEffect(() => {
    if (billing && message) {
      refetchGetMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billing, message]);

  return (
    <Stack justifyContent="center" alignItems="center">
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Box
          component="img"
          src={import.meta.resolve('/images/checkimg.webp')}
          alt="checkimg"
          width={150}
          height={150}
        />
        <Typography fontSize={32} fontWeight={700}>
          {message || '잘못된 접근입니다.'}
        </Typography>
      </Stack>
      <Toolbar />
      <Button variant="contained" component={Link} to="/">
        메인으로
      </Button>
    </Stack>
  );
};

export default PriceChangeSuccessPage;
