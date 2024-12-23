import { Stack, Typography, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface ForbiddenPageProps {}
const ForbiddenPage: React.FC<ForbiddenPageProps> = () => {
  return (
    <Stack alignItems="center" justifyContent="center" flex={1}>
      <Typography variant="h1" fontWeight={700}>
        403
      </Typography>
      <Typography variant="h3" fontWeight={700}>
        Forbidden
      </Typography>
      <Typography variant="h6">권한이 없습니다.</Typography>
      <Toolbar />
      <Button component={Link} variant="contained" to="/">
        메인으로
      </Button>
    </Stack>
  );
};

export default ForbiddenPage;
