import { Button, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface ServicePageProps {}
const ServicePage: React.FC<ServicePageProps> = () => {
  return (
    <Stack>
      <Typography>서비스 선택</Typography>
      <Button
        component={NavLink}
        fullWidth
        variant="outlined"
        color="inherit"
        size="large"
        to="/service/survey"
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
  );
};

export default ServicePage;
