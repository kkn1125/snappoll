import { Button, Container, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface UserPageProps {}
const UserPage: React.FC<UserPageProps> = () => {
  return (
    <Stack>
      <Typography variant="h4" align="center" gutterBottom>
        사용자 서비스 선택
      </Typography>
      <Container maxWidth="sm">
        <Stack gap={3}>
          <Button
            component={NavLink}
            to="/user/profile"
            variant="outlined"
            color="inherit"
            fullWidth
            size="large"
          >
            프로필 보기
          </Button>
          <Button
            component={NavLink}
            to="/user/password"
            variant="outlined"
            color="inherit"
            fullWidth
            size="large"
          >
            비밀번호 변경
          </Button>
          <Button
            component={NavLink}
            to="/user/response"
            variant="outlined"
            color="inherit"
            fullWidth
            size="large"
          >
            나의 응답
          </Button>
        </Stack>
      </Container>
    </Stack>
  );
};

export default UserPage;
