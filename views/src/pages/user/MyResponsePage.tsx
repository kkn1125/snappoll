import { Stack, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface MyResponsePageProps {}
const MyResponsePage: React.FC<MyResponsePageProps> = () => {
  return (
    <Stack gap={3}>
      <Button
        component={NavLink}
        to="/service/poll/me"
        variant="outlined"
        color="inherit"
        fullWidth
        size="large"
      >
        설문 응답
      </Button>
      <Button
        component={NavLink}
        to="/service/vote/me"
        variant="outlined"
        color="inherit"
        fullWidth
        size="large"
      >
        투표 응답
      </Button>
    </Stack>
  );
};

export default MyResponsePage;
