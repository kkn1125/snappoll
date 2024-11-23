import { getPoll } from '@/apis/getPoll';
import PollItem from '@components/moleculars/PollItem';
import { Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Poll } from '@utils/Poll';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface DetailPollProps {
  // title: string;
  // description: string;
  // expiresAt: Date;
  // options: string;
}
const DetailPoll: React.FC<DetailPollProps> = () => {
  const [polls, setPolls] = useState<Poll<PollType['type']>[]>([]);
  const { id } = useParams();

  const { data } = useQuery<APIPoll>({
    queryKey: ['poll'],
    queryFn: getPollOne,
  });

  async function getPollOne() {
    const data = await getPoll(id as string);
    const { options } = data;
    setPolls(JSON.parse(options));
    return data;
  }

  return (
    <Stack>
      <Typography>{data?.title}</Typography>
      <Typography>{data?.description}</Typography>
      <Typography>{data?.expiresAt?.toLocaleString('ko') || ''}</Typography>
      <Stack gap={10}>
        {polls.map((poll) => (
          <PollItem key={poll.id} poll={poll} />
        ))}
        {/* {polls.map((poll, i) => (
          <PollItem key={poll.name + i} poll={poll} />
        ))} */}
      </Stack>
    </Stack>
  );
};

export default DetailPoll;
