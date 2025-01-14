import { Box, Button, Stack, Toolbar, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

interface PriceChangeFailPageProps {}
const PriceChangeFailPage: React.FC<PriceChangeFailPageProps> = () => {
  const { state } = useLocation();
  const message = state.message;
  return (
    <Stack justifyContent="center" alignItems="center" flex={1}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Box
          component="img"
          src={import.meta.resolve('/images/failimg.webp')}
          alt="failimg"
          width={75}
          height={75}
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

export default PriceChangeFailPage;
