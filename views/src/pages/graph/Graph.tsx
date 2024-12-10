import { Button, Container, Stack, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface GraphProps {}
const Graph: React.FC<GraphProps> = () => {
  const navigate = useNavigate();

  const handleRedirect = (to: string) => {
    navigate(`/graph/${to}s`);
  };

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack direction={{ xs: 'column', md: 'row' }} gap={5}>
        <Button
          variant="contained"
          size="large"
          onClick={() => handleRedirect('poll')}
          sx={{
            flex: 1,
            height: 300,
            fontSize: {
              xs: 20,
              md: 40,
            },
            borderRadius: 3,
            background: (theme) => theme.palette.info.dark + '56',
            ['&:hover']: {
              background: (theme) => theme.palette.info.dark,
            },
          }}
        >
          설문지 그래프
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => handleRedirect('vote')}
          sx={{
            flex: 1,
            height: 300,
            fontSize: {
              xs: 20,
              md: 40,
            },
            borderRadius: 3,
            background: (theme) => theme.palette.info.dark + '56',
            ['&:hover']: {
              background: (theme) => theme.palette.info.dark,
            },
          }}
        >
          투표지 그래프
        </Button>
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default Graph;
