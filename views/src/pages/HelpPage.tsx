import { Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface HelpPageProps {}
const HelpPage: React.FC<HelpPageProps> = () => {
  return (
    <Stack gap={3}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        1. Service Guide
      </Typography>
      <Typography variant="body1" gutterBottom>
        1.1 Writing a Survey
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CheckCircleIcon color="success" />
        <Typography variant="body2" color="text.secondary">
          Only logged-in users can write a survey.
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CheckCircleIcon color="success" />
        <Typography variant="body2" color="text.secondary">
          You can write a survey by entering the title, content, and items in
          the survey form.
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CheckCircleIcon color="success" />
        <Typography variant="body2" color="text.secondary">
          You can add multiple items to the survey.
        </Typography>
      </Stack>

      <Typography variant="body1" gutterBottom>
        1.2 Responding to a Survey
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CheckCircleIcon color="success" />
        <Typography variant="body2" color="text.secondary">
          Only logged-in users can respond to a survey.
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CheckCircleIcon color="success" />
        <Typography variant="body2" color="text.secondary">
          You can respond to a survey by selecting an item in the response form.
        </Typography>
      </Stack>

      <Typography variant="body1" gutterBottom>
        1.3 Using a Graph
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CheckCircleIcon color="success" />
        <Typography variant="body2" color="text.secondary">
          The graph displays the results of the survey.
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CheckCircleIcon color="success" />
        <Typography variant="body2" color="text.secondary">
          Only logged-in users can see the graph.
        </Typography>
      </Stack>
    </Stack>
  );
};

export default HelpPage;
