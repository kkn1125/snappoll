import useToken from '@hooks/useToken';
import { Button, Container, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

interface UserPageProps {}
const UserPage: React.FC<UserPageProps> = () => {
  const { user } = useToken();
  return (
    <Stack gap={5}>
      <Typography variant="h4" align="center" gutterBottom>
        사용자 서비스 선택
      </Typography>
      <Container maxWidth="sm">
        <Stack direction={{ xs: 'column', md: 'row' }} gap={3} height={150}>
          <Button
            component={NavLink}
            to="/user/profile"
            variant="outlined"
            color="inherit"
            fullWidth
            size="large"
            sx={{ fontSize: 18 }}
          >
            프로필 보기
          </Button>
          {user?.authProvider === 'Local' && (
            <Fragment>
              <Button
                component={NavLink}
                to="/user/password"
                variant="outlined"
                color="inherit"
                fullWidth
                size="large"
                sx={{ fontSize: 18 }}
              >
                비밀번호 변경
              </Button>
            </Fragment>
          )}
          <Button
            component={NavLink}
            to="/user/response"
            variant="outlined"
            color="inherit"
            fullWidth
            size="large"
            sx={{ fontSize: 18 }}
          >
            나의 응답
          </Button>
        </Stack>
      </Container>
    </Stack>
  );
};

export default UserPage;
