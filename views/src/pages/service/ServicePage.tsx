import { Button, Container, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface ServicePageProps {}
const ServicePage: React.FC<ServicePageProps> = () => {
  return (
    <Stack gap={5}>
      <Typography variant="h4" align="center" gutterBottom>
        서비스 선택
      </Typography>
      <Container maxWidth="sm">
        <Stack direction={{ xs: 'column', md: 'row' }} gap={3} height={150}>
          <Button
            component={NavLink}
            fullWidth
            variant="outlined"
            color="inherit"
            size="large"
            to="/service/poll"
            sx={{ fontSize: 18 }}
          >
            설문조사
          </Button>
          <Button
            component={NavLink}
            fullWidth
            variant="outlined"
            color="inherit"
            size="large"
            to="/service/vote"
            sx={{ fontSize: 18 }}
          >
            투표
          </Button>
          <Button
            component={NavLink}
            fullWidth
            variant="outlined"
            color="inherit"
            size="large"
            to="/service/graph"
            sx={{ fontSize: 18 }}
          >
            통계
          </Button>
        </Stack>
      </Container>
    </Stack>
  );
};

export default ServicePage;
