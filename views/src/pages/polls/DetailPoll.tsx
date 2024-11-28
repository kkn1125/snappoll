import { getPoll } from '@/apis/getPoll';
import { savePollResult } from '@/apis/savePollResult';
import PollLayout from '@components/templates/PollLayout';
import { Button, Container, Divider, Stack, Toolbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Poll } from '@utils/Poll';
import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

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

  const { data, isPending } = useQuery<APIPoll>({
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
    if (data && id) {
      await savePollResult(id, JSON.stringify(polls), !!userId);
      navigate('/');
    }
    return false;
  }

  return (
    <Container>
      <Toolbar />
      <Stack component="form" gap={3} onSubmit={handleSavePollResult}>
        {data && <PollLayout data={data} polls={polls} setPolls={setPolls} />}
        <Divider />
        <Button variant="contained" size="large" type="submit">
          제출
        </Button>
        <Button
          variant="contained"
          size="large"
          type="button"
          color="inherit"
          onClick={() => navigate(-1)}
        >
          이전으로
        </Button>
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default DetailPoll;
