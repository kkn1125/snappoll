import { Button, Container, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface ServicePageProps {}
const ServicePage: React.FC<ServicePageProps> = () => {
  return (
    <Stack>
      <Typography variant="h4" align="center" gutterBottom>
        서비스 선택
      </Typography>
      <Container maxWidth="sm">
        <Stack gap={3}>
          <Button
            component={NavLink}
            fullWidth
            variant="outlined"
            color="inherit"
            size="large"
            to="/service/poll"
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
          >
            통계
          </Button>
        </Stack>
      </Container>
    </Stack>
  );
};

export default ServicePage;
