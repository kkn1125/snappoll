import ReadyAlert from '@components/atoms/ReadyAlert';
import { Container, Stack } from '@mui/material';

interface GraphProps {}
const Graph: React.FC<GraphProps> = () => {
  return (
    <Stack>
      <Container>
        <ReadyAlert />
      </Container>
    </Stack>
  );
};

export default Graph;
