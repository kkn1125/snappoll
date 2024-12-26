import { Stack, Button, Container, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface MyResponsePageProps {}
const MyResponsePage: React.FC<MyResponsePageProps> = () => {
  return (
    <Stack gap={5}>
      <Typography variant="h4" align="center" gutterBottom>
        응답 선택
      </Typography>
      <Container maxWidth="sm">
        <Stack direction={{ xs: 'column', md: 'row' }} gap={3} height={150}>
          <Button
            component={NavLink}
            to="/service/poll/me/response"
            variant="outlined"
            color="inherit"
            fullWidth
            size="large"
            sx={{ fontSize: 18 }}
          >
            설문 응답
          </Button>
          <Button
            component={NavLink}
            to="/service/vote/me/response"
            variant="outlined"
            color="inherit"
            fullWidth
            size="large"
            sx={{ fontSize: 18 }}
          >
            투표 응답
          </Button>
        </Stack>
      </Container>
    </Stack>
  );
};

export default MyResponsePage;
