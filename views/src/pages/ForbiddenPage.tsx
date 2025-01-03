import { Button, Stack, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface ForbiddenPageProps {}
const ForbiddenPage: React.FC<ForbiddenPageProps> = () => {
  return (
    <Stack alignItems="center" justifyContent="center" flex={1} gap={2}>
      <Typography variant="h3" fontWeight={700}>
        안내
      </Typography>
      <Typography variant="h4" fontWeight={700}>
        잘못된 접근
      </Typography>
      <Typography variant="h6">
        권한이 없습니다. 회원 전용 페이지입니다. 로그인 후 접근해주세요.
      </Typography>
      <Toolbar />
      <Stack direction="row" gap={2}>
        <Button component={Link} variant="contained" to="/">
          메인으로
        </Button>
        <Button onClick={() => window.history.back()}>이전으로</Button>
      </Stack>
    </Stack>
  );
};

export default ForbiddenPage;
