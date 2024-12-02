import ReadyAlert from '@components/atoms/ReadyAlert';
import { Container, Stack } from '@mui/material';
import { ChangeEvent, useState } from 'react';

interface GraphProps {}
const Graph: React.FC<GraphProps> = () => {
  const [category, setCategory] = useState<'poll' | 'vote'>('poll');

  const handleChangeCategory = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory((category) => (category === 'poll' ? 'vote' : 'poll'));
  };

  return (
    <Container maxWidth="md">
      <Stack>
        <ReadyAlert />
      </Stack>
    </Container>
  );
};

export default Graph;
