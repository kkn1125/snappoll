import { Button, Stack, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface NotfoundPageProps {
  comment?: string;
}
const NotfoundPage: React.FC<NotfoundPageProps> = ({ comment }) => {
  return (
    <Stack alignItems="center" justifyContent="center" flex={1}>
      <Typography variant="h3" fontWeight={700}>
        404
      </Typography>
      <Typography variant="h4" fontWeight={700}>
        Not Found
      </Typography>
      <Typography variant="h6">
        {comment || '페이지를 찾을 수 없습니다.'}
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

export default NotfoundPage;
