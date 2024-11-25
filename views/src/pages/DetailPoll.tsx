import { getPoll } from '@/apis/getPoll';
import { savePollResult } from '@/apis/savePollResult';
import PollLayout from '@components/templates/PollLayout';
import {
  Button,
  Container,
  Divider,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Poll } from '@utils/Poll';
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface DetailPollProps {
  // title: string;
  // description: string;
  // expiresAt: Date;
  // options: string;
}
const DetailPoll: React.FC<DetailPollProps> = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll<PollType['type']>[]>([]);

  const { id } = useParams();

  const { data } = useQuery<APIPoll>({
    queryKey: ['poll'],
    queryFn: getPollOne,
  });

  async function getPollOne() {
    const data = await getPoll(id as string);
    setPolls(JSON.parse(data.options));
    return data;
  }

  async function handleSavePollResult(e: FormEvent) {
    e.preventDefault();
    const userId = data?.user?.id;
    if (data && id && userId) {
      await savePollResult(id, JSON.stringify(polls));
      navigate('/');
    }
    return false;
  }

  if (!data) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Stack component="form" gap={3} onSubmit={handleSavePollResult}>
        <PollLayout data={data} polls={polls} setPolls={setPolls} />
        <Divider />
        <Button variant="contained" size="large" type="submit">
          제출
        </Button>
      </Stack>
    </Container>
  );
};

export default DetailPoll;
