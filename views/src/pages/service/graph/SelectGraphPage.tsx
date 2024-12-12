import { surveyImage, voteImage } from '@common/variables';
import { Box, Button, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface SelectGraphPageProps {}
const SelectGraphPage: React.FC<SelectGraphPageProps> = () => {
  const navigate = useNavigate();

  const handleRedirect = (to: string) => {
    navigate(`/graph/${to}s`);
  };

  return (
    <Stack direction="row" gap={5} justifyContent="center" flexWrap="wrap">
      <Paper component={Stack} p={1} justifyContent="space-between">
        <Box
          component="img"
          width="100%"
          maxWidth={250}
          src={surveyImage}
          alt="survey"
          sx={{ objectFit: 'cover' }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={() => handleRedirect('poll')}
        >
          설문 그래프
        </Button>
      </Paper>
      <Paper component={Stack} p={1} justifyContent="space-between">
        <Box
          component="img"
          width="100%"
          maxWidth={250}
          src={voteImage}
          alt="survey"
          sx={{ objectFit: 'cover' }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={() => handleRedirect('vote')}
        >
          투표 그래프
        </Button>
      </Paper>
    </Stack>
  );
};

export default SelectGraphPage;
